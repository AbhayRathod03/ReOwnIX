package com.reownix.auction.websocket.service.impl;



import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.reownix.auction.entity.Auction;
import com.reownix.auction.repository.AuctionRepository;
import com.reownix.auction.repository.BidRepository;
import com.reownix.auction.request.PlaceBidRequest;
import com.reownix.auction.response.BidResponse;
import com.reownix.auction.service.BidService;
import com.reownix.auction.websocket.dto.AuctionUpdateMessage;
import com.reownix.auction.websocket.dto.BidMessage;
import com.reownix.auction.websocket.service.AuctionWebSocketService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuctionWebSocketServiceImpl
        implements AuctionWebSocketService {

    private final BidService bidService;

    private final AuctionRepository auctionRepository;

    private final BidRepository bidRepository;

    private final SimpMessagingTemplate messagingTemplate;

    @Override
    public void placeBid(
            String email,
            BidMessage message) {

        PlaceBidRequest request = new PlaceBidRequest();

        request.setAmount(message.getBidAmount());

        BidResponse bidResponse =
                bidService.placeBid(
                        message.getAuctionId(),
                        email,
                        request);

        Auction auction =
                auctionRepository.findById(message.getAuctionId())
                .orElseThrow(() ->
                        new RuntimeException("Auction not found"));

        AuctionUpdateMessage update =
                AuctionUpdateMessage.builder()
                        .auctionId(auction.getId())
                        .currentPrice(auction.getCurrentPrice())
                        .minimumBidIncrement(
                                auction.getMinimumBidIncrement())
                        .highestBidder(
                                bidResponse.getBidderName())
                        .totalBids(
                                (int) bidRepository.countByAuctionId(
                                        auction.getId()))
                        .status(
                                auction.getStatus())
                        .bidTime(
                                bidResponse.getBidTime())
                        .endTime(auction.getEndTime())
                        .winnerId(auction.getWinner() != null ? auction.getWinner().getId() : null)
                        .winnerName(auction.getWinner() != null ? auction.getWinner().getFirstName() + " " + auction.getWinner().getLastName() : null)
                        .ended(auction.getStatus() == com.reownix.auction.enums.AuctionStatus.ENDED)
                        .build();

        messagingTemplate.convertAndSend(
                "/topic/auction/" + auction.getId(),
                update);

    }
}