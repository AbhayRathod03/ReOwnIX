package com.reownix.auction.service.impl;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.reownix.auction.entity.Auction;
import com.reownix.auction.entity.Bid;
import com.reownix.auction.enums.AuctionStatus;
import com.reownix.auction.exception.AuctionNotFoundException;
import com.reownix.auction.exception.InvalidBidException;
import com.reownix.auction.repository.AuctionRepository;
import com.reownix.auction.repository.BidRepository;
import com.reownix.auction.request.PlaceBidRequest;
import com.reownix.auction.response.BidResponse;
import com.reownix.auction.service.BidService;
import com.reownix.auction.websocket.exception.AuctionEndedException;
import com.reownix.auction.websocket.exception.AuctionNotActiveException;
import com.reownix.auction.websocket.exception.MinimumBidIncrementException;
import com.reownix.auction.websocket.exception.SelfBiddingNotAllowedException;
import com.reownix.auth.entity.User;
import com.reownix.auth.exception.UserNotFoundException;
import com.reownix.auth.repository.UserRepository;
import com.reownix.product.exception.UnauthorizedException;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import com.reownix.auction.entity.AuctionEvent;
import com.reownix.auction.enums.AuctionEventType;
import com.reownix.auction.repository.AuctionEventRepository;
import com.reownix.auction.websocket.dto.BidBroadcastMessage;
import com.reownix.auction.websocket.dto.AuctionEventMessage;

import lombok.RequiredArgsConstructor;

@Transactional
@Service
@RequiredArgsConstructor
public class BidServiceImpl implements BidService {
	
    private final AuctionRepository auctionRepository;
    private final BidRepository bidRepository;
    private final UserRepository userRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final AuctionEventRepository auctionEventRepository;

    @Override
    @Transactional
    public BidResponse placeBid(
            Long auctionId,
            String email,
            PlaceBidRequest request) {

        User bidder = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UserNotFoundException("User not found"));

        // Block banned users — critical for WebSocket sessions where auth
        // happens only once at CONNECT time. A banned user could still hold
        // an active WebSocket session. This DB check closes that window.
        if (!bidder.getEnabled()) {
            throw new UnauthorizedException(
                    "Your account has been suspended. You cannot place bids.");
        }

        Auction auction = auctionRepository.findWithLockById(auctionId)
                .orElseThrow(() ->
                        new AuctionNotFoundException("Auction not found"));

        if (auction.getStatus() != AuctionStatus.ACTIVE) {
            throw new AuctionEndedException("Auction is not active");
        }

        if (auction.getEndTime().isBefore(java.time.LocalDateTime.now())) {
            throw new AuctionEndedException("Auction has ended");
        }

        if (auction.getProduct().getOwner().getId().equals(bidder.getId())) {
            throw new SelfBiddingNotAllowedException(
                    "Owner cannot bid on own product");
        }

        BigDecimal minimumAllowed = auction.getCurrentPrice()
                .add(auction.getMinimumBidIncrement());

        if (request.getAmount().compareTo(minimumAllowed) < 0) {
            throw new MinimumBidIncrementException(
                    "Minimum allowed bid is " + minimumAllowed);
        }

        Bid previousHighestBid = bidRepository
                .findTopByAuctionOrderByAmountDescBidTimeAsc(auction)
                .orElse(null);

        if (previousHighestBid != null && previousHighestBid.getBidder().getId().equals(bidder.getId())) {
            throw new InvalidBidException("You are already the highest bidder. Wait until another user places a higher bid.");
        }

        // Save every valid bid
        Bid bid = Bid.builder()
                .auction(auction)
                .bidder(bidder)
                .amount(request.getAmount())
                .build();

        bidRepository.save(bid);

        Bid highestBid = bidRepository
                .findTopByAuctionOrderByAmountDescBidTimeAsc(auction)
                .orElseThrow(() ->
                        new RuntimeException("Highest bid not found"));

        auction.setCurrentPrice(highestBid.getAmount());
        auction.setWinner(highestBid.getBidder());

        // Anti-sniping: extend auction if bid arrives in final 2 minutes
        if (auction.getEndTime().minusMinutes(2).isBefore(java.time.LocalDateTime.now())) {
            java.time.LocalDateTime newEndTime = auction.getEndTime().plusMinutes(2);

            // Respect maxEndTime cap (if set)
            if (auction.getMaxEndTime() != null && newEndTime.isAfter(auction.getMaxEndTime())) {
                newEndTime = auction.getMaxEndTime();
            }

            // Only extend if there's actually time to add
            if (newEndTime.isAfter(auction.getEndTime())) {
                auction.setEndTime(newEndTime);
            }
        }

        auctionRepository.save(auction);

        AuctionEvent event = AuctionEvent.builder()
                .auction(auction)
                .type(AuctionEventType.NEW_BID)
                .user(bidder)
                .price(request.getAmount())
                .build();
        auctionEventRepository.save(event);

        if (previousHighestBid != null && !previousHighestBid.getBidder().getId().equals(bidder.getId())) {
            messagingTemplate.convertAndSendToUser(
                    previousHighestBid.getBidder().getEmail(),
                    "/queue/notifications",
                    "You have been outbid."
            );
        }

        BidBroadcastMessage bidBroadcast = BidBroadcastMessage.builder()
                .auctionId(auction.getId())
                .bidderId(bidder.getId())
                .bidderName(bidder.getFirstName() + " " + bidder.getLastName())
                .amount(request.getAmount())
                .bidTime(bid.getBidTime())
                .build();
        messagingTemplate.convertAndSend("/topic/auction/" + auction.getId() + "/bids", bidBroadcast);

        AuctionEventMessage eventMessage = AuctionEventMessage.builder()
                .type(AuctionEventType.NEW_BID)
                .auctionId(auction.getId())
                .timestamp(java.time.LocalDateTime.now())
                .payload(bidBroadcast)
                .build();
        messagingTemplate.convertAndSend("/topic/auction/" + auction.getId() + "/events", eventMessage);

        return BidResponse.builder()
                .id(bid.getId())
                .auctionId(auction.getId())
                .bidderName(
                        bidder.getFirstName() + " " +
                        bidder.getLastName())
                .amount(bid.getAmount())
                .bidTime(bid.getBidTime())
                .build();
    }
    @Override
    public List<BidResponse> getAuctionBids(Long auctionId) {

        Auction auction = auctionRepository.findById(auctionId)
                .orElseThrow(() ->
                        new AuctionNotFoundException("Auction not found"));

        return bidRepository.findByAuctionOrderByAmountDesc(auction)
                .stream()
                .map(bid ->

                        BidResponse.builder()
                                .id(bid.getId())
                                .auctionId(auction.getId())
                                .bidderName(
                                        bid.getBidder().getFirstName()
                                        + " "
                                        + bid.getBidder().getLastName())
                                .amount(bid.getAmount())
                                .bidTime(bid.getBidTime())
                                .build()

                )
                .toList();
    }

    @Override
    public List<BidResponse> getMyBids(String email) {

        User bidder = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UserNotFoundException("User not found"));

        return bidRepository.findByBidder(bidder)
                .stream()
                .map(bid ->

                        BidResponse.builder()
                                .id(bid.getId())
                                .auctionId(bid.getAuction().getId())
                                .bidderName(
                                        bidder.getFirstName()
                                        + " "
                                        + bidder.getLastName())
                                .amount(bid.getAmount())
                                .bidTime(bid.getBidTime())
                                .build()

                )
                .toList();
    }

}
