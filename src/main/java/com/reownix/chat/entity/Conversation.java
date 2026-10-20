package com.reownix.chat.entity;

import java.time.LocalDateTime;
import java.util.List;

import com.reownix.auth.entity.User;
import com.reownix.product.entity.Product;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(
    name = "conversations",
    uniqueConstraints = {
        @UniqueConstraint(
            columnNames = {
                "buyer_id",
                "seller_id",
                "product_id"
            }
        )
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Conversation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Buyer who initiated the chat
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "buyer_id", nullable = false)
    private User buyer;

    // Seller who owns the product
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seller_id", nullable = false)
    private User seller;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @OneToMany(
            mappedBy = "conversation",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<Message> messages;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    public void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}