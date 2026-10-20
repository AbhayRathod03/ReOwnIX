package com.reownix.offer.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.reownix.offer.entity.Offer;
import com.reownix.offer.enums.OfferStatus;
import com.reownix.offer.repository.OfferRepository;
import com.reownix.offer.request.MakeOfferRequest;
import com.reownix.offer.response.OfferResponse;
import com.reownix.offer.service.OfferService;
import com.reownix.auth.entity.User;
import com.reownix.auth.exception.UserNotFoundException;
import com.reownix.auth.repository.UserRepository;
import com.reownix.product.entity.Product;
import com.reownix.product.exception.ProductNotFoundException;
import com.reownix.product.exception.UnauthorizedException;
import com.reownix.product.repository.ProductRepository;
import com.reownix.chat.service.ChatService;
import com.reownix.chat.request.StartConversationRequest;
import com.reownix.chat.request.SendMessageRequest;
import com.reownix.chat.response.ConversationResponse;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class OfferServiceImpl implements OfferService {

    private final OfferRepository offerRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final ChatService chatService;

    @Override
    public OfferResponse makeOffer(String email, MakeOfferRequest request) {
        User buyer = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ProductNotFoundException("Product not found"));

        if (product.getListingType() == com.reownix.product.enums.ListingType.AUCTION) {
            throw new IllegalArgumentException("Cannot make offers on auction products");
        }

        if (product.getOwner().getId().equals(buyer.getId())) {
            throw new IllegalArgumentException("You cannot make an offer on your own product");
        }

        Offer offer = Offer.builder()
                .product(product)
                .buyer(buyer)
                .amount(request.getAmount())
                .status(OfferStatus.PENDING)
                .build();

        offer = offerRepository.save(offer);

        try {
            ConversationResponse conv = chatService.startConversation(
                email, 
                StartConversationRequest.builder().productId(product.getId()).build()
            );
            chatService.sendMessage(
                conv.getConversationId(), 
                email, 
                SendMessageRequest.builder().message("I have made an offer of ₹" + offer.getAmount() + " for this product!").build()
            );
        } catch(Exception e) {
            // Silently swallow chat errors so offer creation still succeeds
        }

        return mapToResponse(offer);
    }

    @Override
    public List<OfferResponse> getProductOffers(Long productId, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ProductNotFoundException("Product not found"));

        if (!product.getOwner().getId().equals(user.getId())) {
            throw new UnauthorizedException("Only the seller can view offers for this product");
        }

        return offerRepository.findByProductOrderByCreatedAtDesc(product)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public List<OfferResponse> getMyOffers(String email) {
        User buyer = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        return offerRepository.findByBuyerOrderByCreatedAtDesc(buyer)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public OfferResponse updateOfferStatus(Long offerId, OfferStatus status, String email) {
        User seller = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        Offer offer = offerRepository.findById(offerId)
                .orElseThrow(() -> new RuntimeException("Offer not found"));

        if (!offer.getProduct().getOwner().getId().equals(seller.getId())) {
            throw new UnauthorizedException("Only the seller can update offer status");
        }

        if (offer.getStatus() != OfferStatus.PENDING) {
            throw new IllegalStateException("Offer has already been processed and cannot be changed");
        }

        offer.setStatus(status);
        offer = offerRepository.save(offer);

        return mapToResponse(offer);
    }

    private OfferResponse mapToResponse(Offer offer) {
        return OfferResponse.builder()
                .id(offer.getId())
                .productId(offer.getProduct().getId())
                .productTitle(offer.getProduct().getTitle())
                .productThumbnail(
                        offer.getProduct().getImages() != null && !offer.getProduct().getImages().isEmpty()
                                ? offer.getProduct().getImages().get(0).getImageUrl()
                                : null)
                .buyerName(offer.getBuyer().getFirstName() + " " + offer.getBuyer().getLastName())
                .amount(offer.getAmount())
                .status(offer.getStatus())
                .createdAt(offer.getCreatedAt())
                .build();
    }
}
