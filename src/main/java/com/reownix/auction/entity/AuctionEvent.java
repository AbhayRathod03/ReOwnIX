package com.reownix.auction.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import com.reownix.auction.enums.AuctionEventType;
import com.reownix.auth.entity.User;

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
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "auction_events")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuctionEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "auction_id", nullable = false)
    private Auction auction;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AuctionEventType type;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private BigDecimal price;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        createdAt = LocalDateTime.now();
    }
 
}
