package com.reownix.offer.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.reownix.auth.entity.User;
import com.reownix.product.entity.Product;
import com.reownix.offer.enums.OfferStatus;

@Entity
@Table(name = "offers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Offer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "buyer_id", nullable = false)
    private User buyer;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OfferStatus status;

    @CreationTimestamp
    private LocalDateTime createdAt;
}
