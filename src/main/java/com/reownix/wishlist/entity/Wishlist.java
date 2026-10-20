package com.reownix.wishlist.entity;

import java.time.LocalDateTime;

import com.reownix.auth.entity.User;
import com.reownix.product.entity.Product;

import jakarta.annotation.Generated;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "wishlist")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Wishlist {
    
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "buyer_id",nullable = false)
	private User buyer;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "product_id",nullable = false)
	private Product product;
	
	private LocalDateTime createdAt;
	
	@PrePersist
	public void prePersist() {
		createdAt = LocalDateTime.now();
	}
	
	
}

