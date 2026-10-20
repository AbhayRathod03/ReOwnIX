package com.reownix.admin.service.impl;

import java.util.List;

import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.reownix.admin.response.DashboardResponse;
import com.reownix.admin.service.AdminService;
import com.reownix.auction.entity.Auction;
import com.reownix.auction.exception.AuctionNotFoundException;
import com.reownix.auction.repository.AuctionRepository;
import com.reownix.auction.response.AuctionResponse;
import com.reownix.auth.entity.User;
import com.reownix.auth.exception.UserNotFoundException;
import com.reownix.auth.repository.UserRepository;
import com.reownix.auth.response.UserResponse;
import com.reownix.product.dto.response.ProductResponse;
import com.reownix.product.entity.Product;
import com.reownix.product.exception.ProductNotFoundException;
import com.reownix.product.repository.CategoryRepository;
import com.reownix.product.repository.ProductRepository;
import com.reownix.wishlist.entity.Wishlist;
import com.reownix.wishlist.repository.WishlistRepository;
import com.reownix.product.dto.response.OwnerDTO;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {
	
	private final UserRepository userRepository;
	private final ProductRepository productRepository;
	private final CategoryRepository categoryRepository;
	private final AuctionRepository auctionRepository;
	private final WishlistRepository wishlistRepository;
	private final com.reownix.offer.repository.OfferRepository offerRepository;
	private final com.reownix.review.repository.ReviewRepository reviewRepository;
	private final com.reownix.chat.repository.MessageRepository messageRepository;
	
	
	
	@Override
	public DashboardResponse getDashboard() {
		return DashboardResponse.builder()
				.totalUsers(userRepository.count())
				.activeUsers(userRepository.countByStatus(com.reownix.auth.enums.UserStatus.ACTIVE))
				.totalProducts(productRepository.count())
				.availableProducts(productRepository.countByStatus(com.reownix.product.enums.ProductStatus.AVAILABLE))
				.soldProducts(productRepository.countByStatus(com.reownix.product.enums.ProductStatus.SOLD))
				.totalCategories(categoryRepository.count())
				.totalAuctions(auctionRepository.count())
				.activeAuctions(auctionRepository.countByStatus(com.reownix.auction.enums.AuctionStatus.ACTIVE))
				.completedAuctions(auctionRepository.countByStatus(com.reownix.auction.enums.AuctionStatus.ENDED))
				.pendingOffers(offerRepository.countByStatus(com.reownix.offer.enums.OfferStatus.PENDING))
				.acceptedOffers(offerRepository.countByStatus(com.reownix.offer.enums.OfferStatus.ACCEPTED))
				.totalWishlistItems(wishlistRepository.count())
				.reviews(reviewRepository.count())
				.messages(messageRepository.count())
				.build();
	}

	@Override
	public List<UserResponse> getAllUsers() {
		return userRepository.findAll()
				.stream()
				.map(this::mapToResponse)
				.toList();
	}

	@Override
	public UserResponse getUserById(Long id) {

		User user = userRepository.findById(id)
				.orElseThrow(() ->
				new UsernameNotFoundException("User Not Found"));
		return mapToResponse(user);
	}

	@Override
	public void disableUser(Long id) {
		User user = userRepository.findById(id)
				.orElseThrow(() -> 
				new UsernameNotFoundException("User Not Found"));
		
		user.setEnabled(false);
		
		userRepository.save(user);
	}

    @Override
    public void enableUser(Long id) {

        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new UserNotFoundException("User not found"));

        user.setEnabled(true);

        userRepository.save(user);
    }


    @Override
    public void deleteUser(Long id) {

        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new UserNotFoundException("User not found"));

        user.setDeleted(true);
        user.setEnabled(false);

        userRepository.save(user);
    }
	
    private UserResponse mapToResponse(User user) {

        return UserResponse.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .address(user.getAddress())
                .profileImage(user.getProfileImage())
                .role(user.getRole().getRoleName().name())
                .build();
    }

    @Override
    public List<ProductResponse> getAllProducts() {

        return productRepository.findAll()
                .stream()
                .map(product -> {

                    OwnerDTO owner = OwnerDTO.builder()
                            .id(product.getOwner().getId())
                            .firstName(product.getOwner().getFirstName())
                            .lastName(product.getOwner().getLastName())
                            .email(product.getOwner().getEmail())
                            .profileImage(product.getOwner().getProfileImage())
                            .build();

                    return ProductResponse.builder()
                            .id(product.getId())
                            .title(product.getTitle())
                            .price(product.getPrice())
                            .brand(product.getBrand())
                            .condition(product.getCondition())
                            .listingType(product.getListingType())
                            .category(
                                    product.getCategory() != null
                                            ? product.getCategory().getName()
                                            : null
                            )
                            .owner(owner)
                            .thumbnail(
                                    product.getImages() != null &&
                                    !product.getImages().isEmpty()
                                            ? product.getImages().get(0).getImageUrl()
                                            : null
                            )
                            .build();
                })
                .toList();
    }

    @Override
    public void deleteProduct(Long productId) {

        Product product = productRepository.findById(productId)
                .orElseThrow(() ->
                        new ProductNotFoundException("Product not found"));

        productRepository.delete(product);
    }



    @Override
    public void deleteAuction(Long auctionId) {

        Auction auction = auctionRepository.findById(auctionId)
                .orElseThrow(() ->
                        new AuctionNotFoundException("Auction not found"));

        auctionRepository.delete(auction);
    }

    @Override
    public List<AuctionResponse> getAllAuctions() {

        return auctionRepository.findAll()
                .stream()
                .map(auction -> AuctionResponse.builder()
                        .id(auction.getId())
                        .productId(auction.getProduct().getId())
                        .productTitle(auction.getProduct().getTitle())
                        .currentPrice(auction.getCurrentPrice())
                        .minimumBidIncrement(auction.getMinimumBidIncrement())
                        .status(auction.getStatus())
                        .startTime(auction.getStartTime())
                        .endTime(auction.getEndTime())
                        .build())
                .toList();
    }
	

}
