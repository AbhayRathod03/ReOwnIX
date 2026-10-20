package com.reownix.product.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import com.reownix.auth.entity.User;
import com.reownix.product.enums.ListingType;
import com.reownix.product.enums.ProductCondition;
import com.reownix.product.enums.ProductStatus;

import com.reownix.auction.entity.Auction;
import com.reownix.chat.entity.Conversation;
import com.reownix.offer.entity.Offer;
import com.reownix.review.entity.Review;
import com.reownix.wishlist.entity.Wishlist;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
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
@Table(name = "products")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(length = 3000)
    private String description;

    @Column(nullable = false)
    private BigDecimal price;

    @Column(nullable = false)
    private Integer quantity;

    private String brand;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProductCondition condition;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProductStatus status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @OneToMany(
            mappedBy = "product",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<ProductImage> images;

    @OneToOne(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private Auction auction;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Conversation> conversations;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Offer> offers;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Review> reviews;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Wishlist> wishlists;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ListingType listingType;

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