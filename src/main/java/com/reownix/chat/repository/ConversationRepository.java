package com.reownix.chat.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.reownix.auth.entity.User;
import com.reownix.chat.entity.Conversation;
import com.reownix.product.entity.Product;

public interface ConversationRepository extends JpaRepository<Conversation, Long> {

    Optional<Conversation> findByBuyerAndSellerAndProduct(
            User buyer,
            User seller,
            Product product);

    @Query("""
            SELECT DISTINCT c
            FROM Conversation c
            JOIN FETCH c.product
            JOIN FETCH c.buyer
            JOIN FETCH c.seller
            WHERE c.buyer = :user
               OR c.seller = :user
            ORDER BY c.updatedAt DESC
            """)
        List<Conversation> findAllByUser(@Param("user") User user);

        @Query("""
            SELECT c
            FROM Conversation c
            JOIN FETCH c.product
            JOIN FETCH c.buyer
            JOIN FETCH c.seller
            WHERE c.id = :conversationId
              AND (c.buyer = :user OR c.seller = :user)
            """)
        Optional<Conversation> findByIdAndUser(
                @Param("conversationId") Long conversationId,
                @Param("user") User user);
        
        @Query("""
        	    SELECT c
        	    FROM Conversation c
        	    JOIN FETCH c.buyer
        	    JOIN FETCH c.seller
        	    WHERE c.id = :conversationId
        	    """)
        	Optional<Conversation> findByIdWithUsers(
        	        @Param("conversationId") Long conversationId);

        @Query("""
            SELECT CASE WHEN COUNT(c) > 0 THEN true ELSE false END
            FROM Conversation c
            WHERE c.id = :conversationId
              AND (c.buyer.email = :email OR c.seller.email = :email)
            """)
        boolean existsByIdAndParticipantEmail(
                @Param("conversationId") Long conversationId,
                @Param("email") String email);

}