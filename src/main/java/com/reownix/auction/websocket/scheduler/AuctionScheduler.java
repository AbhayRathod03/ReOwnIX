package com.reownix.auction.websocket.scheduler;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.reownix.auction.entity.Auction;
import com.reownix.auction.enums.AuctionStatus;
import com.reownix.auction.repository.AuctionRepository;
import com.reownix.auction.repository.BidRepository;
import com.reownix.auction.websocket.dto.AuctionUpdateMessage;
import com.reownix.auction.entity.AuctionEvent;
import com.reownix.auction.enums.AuctionEventType;
import com.reownix.auction.repository.AuctionEventRepository;
import com.reownix.auction.websocket.dto.AuctionEventMessage;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class AuctionScheduler {

    private final AuctionRepository auctionRepository;
    private final BidRepository bidRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final AuctionEventRepository auctionEventRepository;

    @Transactional
    @Scheduled(fixedRate = 5000)
    public void updateAuctionStatus() {
        LocalDateTime now = LocalDateTime.now();
        activateUpcomingAuctions(now);
        endExpiredAuctions(now);
    }

    private void activateUpcomingAuctions(LocalDateTime now) {
        List<Auction> upcomingAuctions = auctionRepository.findAuctionsWithDetailsByStatus(AuctionStatus.UPCOMING);

        for (Auction auction : upcomingAuctions) {
            if (!auction.getStartTime().isAfter(now)) {
                auction.setStatus(AuctionStatus.ACTIVE);
                auctionRepository.save(auction);

                AuctionEvent event = AuctionEvent.builder()
                        .auction(auction)
                        .type(AuctionEventType.STARTED)
                        .build();
                auctionEventRepository.save(event);

                AuctionEventMessage eventMessage = AuctionEventMessage.builder()
                        .type(AuctionEventType.STARTED)
                        .auctionId(auction.getId())
                        .timestamp(java.time.LocalDateTime.now())
                        .payload(null)
                        .build();
                messagingTemplate.convertAndSend("/topic/auction/" + auction.getId() + "/events", eventMessage);

                sendUpdate(auction);
            }
        }
    }

    private void endExpiredAuctions(LocalDateTime now) {
        List<Auction> activeAuctions = auctionRepository.findAuctionsWithDetailsByStatus(AuctionStatus.ACTIVE);

        for (Auction auction : activeAuctions) {
            if (!auction.getEndTime().isAfter(now)) {
                auction.setStatus(AuctionStatus.ENDED);

                bidRepository.findTopByAuctionOrderByAmountDesc(auction)
                        .ifPresent(highestBid -> {
                            auction.setWinner(highestBid.getBidder());
                            auction.setCurrentPrice(highestBid.getAmount());
                        });

                auctionRepository.save(auction);

                AuctionEvent endedEvent = AuctionEvent.builder()
                        .auction(auction)
                        .type(AuctionEventType.ENDED)
                        .build();
                auctionEventRepository.save(endedEvent);

                AuctionEventMessage endedMessage = AuctionEventMessage.builder()
                        .type(AuctionEventType.ENDED)
                        .auctionId(auction.getId())
                        .timestamp(java.time.LocalDateTime.now())
                        .payload(null)
                        .build();
                messagingTemplate.convertAndSend("/topic/auction/" + auction.getId() + "/events", endedMessage);

                if (auction.getWinner() != null) {
                    AuctionEvent winnerEvent = AuctionEvent.builder()
                            .auction(auction)
                            .type(AuctionEventType.WINNER_DECLARED)
                            .user(auction.getWinner())
                            .price(auction.getCurrentPrice())
                            .build();
                    auctionEventRepository.save(winnerEvent);

                    AuctionEventMessage winnerMessage = AuctionEventMessage.builder()
                            .type(AuctionEventType.WINNER_DECLARED)
                            .auctionId(auction.getId())
                            .timestamp(java.time.LocalDateTime.now())
                            .payload(auction.getWinner().getId())
                            .build();
                    messagingTemplate.convertAndSend("/topic/auction/" + auction.getId() + "/events", winnerMessage);

                    messagingTemplate.convertAndSendToUser(
                            auction.getWinner().getEmail(),
                            "/queue/notifications",
                            "Congratulations!\nYou won the auction."
                    );
                }

                messagingTemplate.convertAndSendToUser(
                        auction.getProduct().getOwner().getEmail(),
                        "/queue/notifications",
                        "Your auction has ended."
                );

                sendUpdate(auction);
            }
        }
    }

    private void sendUpdate(Auction auction) {

        AuctionUpdateMessage message =
                AuctionUpdateMessage.builder()
                        .auctionId(auction.getId())
                        .currentPrice(auction.getCurrentPrice())
                        .minimumBidIncrement(auction.getMinimumBidIncrement())
                        .status(auction.getStatus())
                        .highestBidder(
                                auction.getWinner() == null
                                        ? null
                                        : auction.getWinner().getFirstName()
                                        + " "
                                        + auction.getWinner().getLastName())
                        .totalBids(
                                (int) bidRepository.countByAuctionId(
                                        auction.getId()))
                        .endTime(auction.getEndTime())
                        .winnerId(auction.getWinner() != null ? auction.getWinner().getId() : null)
                        .winnerName(auction.getWinner() != null ? auction.getWinner().getFirstName() + " " + auction.getWinner().getLastName() : null)
                        .ended(auction.getStatus() == AuctionStatus.ENDED)
                        .build();

        messagingTemplate.convertAndSend(
                "/topic/auction/" + auction.getId(),
                message);
    }
}