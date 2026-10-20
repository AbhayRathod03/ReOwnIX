package com.reownix.auction.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import com.reownix.auction.enums.AuctionStatus;
import com.reownix.auth.entity.User;
import com.reownix.product.entity.Product;

import jakarta.annotation.Generated;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "auction")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Auction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "product_id", nullable = false, unique = true)
    private Product product;

    @Column(nullable = false)
    private BigDecimal startingPrice;

    @Column(nullable = false)
    private BigDecimal currentPrice;

    @Column(nullable = false)
    private BigDecimal minimumBidIncrement;

    @Column(nullable = false)
    private LocalDateTime startTime;

    @Column(nullable = false)
    private LocalDateTime endTime;

    private LocalDateTime maxEndTime;  // Absolute cap for anti-sniping extensions (null = no limit)

    @Enumerated(EnumType.STRING)
    private AuctionStatus status;

    @ManyToOne
    @JoinColumn(name = "winner_id")
    private User winner;
    
    @OneToMany(
    	    mappedBy = "auction",
    	    cascade = CascadeType.ALL,
    	    orphanRemoval = true
    	)
    	private List<AuctionEvent> events;

    @OneToMany(
    	    mappedBy = "auction",
    	    cascade = CascadeType.ALL,
    	    orphanRemoval = true
    	)
    	private List<Bid> bids;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
