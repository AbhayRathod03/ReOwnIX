package com.reownix.auction.entity;


import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.reownix.auth.entity.User;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(
    name = "bids",
    indexes = {
        @Index(
            name = "idx_bid_auction_amount",
            columnList = "auction_id, amount"
        ),
        @Index(
            name = "idx_bid_bidder",
            columnList = "bidder_id"
        )
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Bid {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "auction_id")
    private Auction auction;

    @ManyToOne
    @JoinColumn(name = "bidder_id")
    private User bidder;

    @Column(nullable = false)
    private BigDecimal amount;

    @Column(nullable = false, updatable = false)
    private LocalDateTime bidTime;

    @PrePersist
    public void prePersist() {
        bidTime = LocalDateTime.now();
    }
}
