package com.reownix.product.service.impl;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.reownix.auction.repository.AuctionRepository;
import com.reownix.auth.entity.User;
import com.reownix.auth.exception.UserNotFoundException;
import com.reownix.auth.repository.UserRepository;
import com.reownix.product.dto.request.CreateProductRequest;
import com.reownix.product.dto.request.UpdateProductRequest;
import com.reownix.product.dto.response.ProductDetailsResponse;
import com.reownix.product.dto.response.ProductResponse;
import com.reownix.product.entity.Category;
import com.reownix.product.entity.Product;
import com.reownix.product.entity.ProductImage;
import com.reownix.product.enums.ListingType;
import com.reownix.product.enums.ProductCondition;
import com.reownix.product.enums.ProductStatus;
import com.reownix.product.exception.CategoryNotFoundException;
import com.reownix.product.exception.ProductNotFoundException;
import com.reownix.product.exception.UnauthorizedException;
import com.reownix.product.repository.CategoryRepository;
import com.reownix.product.repository.ProductRepository;

/**
 * ============================================================================
 *  UNIT TESTS for ProductServiceImpl
 * ============================================================================
 *
 *  📖 KEY INTERVIEW CONCEPTS COVERED:
 *
 *  1. @Mock vs @InjectMocks
 *     - @Mock creates a fake (mock) object of a dependency
 *     - @InjectMocks creates the REAL object and injects all @Mock objects into it
 *
 *  2. when(...).thenReturn(...)  → "Given this happens, return this"
 *     - This is called STUBBING — telling the mock what to return
 *
 *  3. verify(...)  → "Make sure this method was actually called"
 *     - This is VERIFICATION — confirming interactions happened
 *
 *  4. assertThat(...)  → "Check the result matches expectations"
 *     - This is ASSERTION — validating the output
 *
 *  5. assertThatThrownBy(...)  → "This should throw an exception"
 *     - This tests the UNHAPPY PATH — error scenarios
 *
 *  6. ArgumentCaptor  → "Capture what was passed to a mock"
 *     - This is an advanced concept to inspect exact arguments
 *
 *  🧪 TEST STRUCTURE → AAA Pattern (Arrange → Act → Assert)
 *     - Arrange: Set up test data and mock behavior
 *     - Act:     Call the method being tested
 *     - Assert:  Verify the result
 * ============================================================================
 */
@ExtendWith(MockitoExtension.class)   // WHY: Initializes @Mock and @InjectMocks automatically
class ProductServiceImplTest {

    // ═══════════════════════════════════════════════════════════════════════
    // STEP 1: Declare Mocks (fake versions of dependencies)
    // ═══════════════════════════════════════════════════════════════════════
    // WHY @Mock?  ProductServiceImpl depends on these repositories.
    //             We don't want to hit a real DB in UNIT tests.
    //             Mocks let us control what these return.

    @Mock
    private ProductRepository productRepository;

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private AuctionRepository auctionRepository;

    // WHY @InjectMocks?  This creates the REAL ProductServiceImpl
    //                    and automatically injects all 4 @Mock objects above.
    @InjectMocks
    private ProductServiceImpl productService;

    // ═══════════════════════════════════════════════════════════════════════
    // STEP 2: Shared Test Data (reusable across all tests)
    // ═══════════════════════════════════════════════════════════════════════

    private User testOwner;
    private User anotherUser;
    private Category testCategory;
    private Product testProduct;
    private CreateProductRequest createRequest;
    private UpdateProductRequest updateRequest;

    @BeforeEach  // WHY: Runs before EVERY test method, giving each test fresh data
    void setUp() {
        // --- Build a test User ---
        testOwner = User.builder()
                .id(1L)
                .firstName("Abhay")
                .lastName("Rathod")
                .email("abhay@test.com")
                .password("encoded_pass")
                .phone("1234567890")
                .address("Test City")
                .profileImage("profile.jpg")
                .createdAt(LocalDateTime.now())
                .build();

        anotherUser = User.builder()
                .id(2L)
                .firstName("John")
                .lastName("Doe")
                .email("john@test.com")
                .password("encoded_pass")
                .build();

        // --- Build a test Category ---
        testCategory = Category.builder()
                .id(1L)
                .name("Electronics")
                .description("Electronic items")
                .build();

        // --- Build a test Product ---
        ProductImage image = ProductImage.builder()
                .id(1L)
                .imageUrl("http://image.com/test.jpg")
                .build();

        testProduct = Product.builder()
                .id(1L)
                .title("iPhone 15")
                .description("Brand new iPhone")
                .price(BigDecimal.valueOf(999.99))
                .quantity(5)
                .brand("Apple")
                .condition(ProductCondition.NEW)
                .listingType(ListingType.FIXED_PRICE)
                .status(ProductStatus.AVAILABLE)
                .owner(testOwner)
                .category(testCategory)
                .images(new ArrayList<>(List.of(image)))
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        image.setProduct(testProduct);

        // --- Build request DTOs ---
        createRequest = CreateProductRequest.builder()
                .title("iPhone 15")
                .description("Brand new iPhone")
                .price(BigDecimal.valueOf(999.99))
                .quantity(5)
                .brand("Apple")
                .condition(ProductCondition.NEW)
                .listingType(ListingType.FIXED_PRICE)
                .categoryId(1L)
                .build();

        updateRequest = UpdateProductRequest.builder()
                .title("iPhone 15 Pro")
                .description("Updated iPhone")
                .price(BigDecimal.valueOf(1199.99))
                .quantity(3)
                .brand("Apple")
                .condition(ProductCondition.LIKE_NEW)
                .listingType(ListingType.FIXED_PRICE)
                .categoryId(1L)
                .build();
    }

    // ═══════════════════════════════════════════════════════════════════════
    //  📗 TEST GROUP 1: createProduct()
    // ═══════════════════════════════════════════════════════════════════════
    @Nested  // WHY @Nested: Groups related tests together — cleaner reports
    @DisplayName("createProduct()")
    class CreateProductTests {

        @Test
        @DisplayName("✅ Should create product successfully when user and category exist")
        void createProduct_Success() {
            // ── ARRANGE ──
            // WHY: Tell the mock "when someone searches for this email, return our test user"
            when(userRepository.findByEmail("abhay@test.com"))
                    .thenReturn(Optional.of(testOwner));

            when(categoryRepository.findById(1L))
                    .thenReturn(Optional.of(testCategory));

            // WHY: The save method returns the saved entity; we control what it returns
            when(productRepository.save(any(Product.class)))
                    .thenReturn(testProduct);

            // ── ACT ──
            ProductResponse result = productService.createProduct("abhay@test.com", createRequest);

            // ── ASSERT ──
            // WHY: assertThat is from AssertJ — more readable than JUnit's assertEquals
            assertThat(result).isNotNull();
            assertThat(result.getTitle()).isEqualTo("iPhone 15");
            assertThat(result.getPrice()).isEqualByComparingTo(BigDecimal.valueOf(999.99));
            assertThat(result.getBrand()).isEqualTo("Apple");
            assertThat(result.getCondition()).isEqualTo(ProductCondition.NEW);
            assertThat(result.getCategory()).isEqualTo("Electronics");

            // WHY verify: Confirm save() was actually called (not just skipped)
            verify(productRepository).save(any(Product.class));
        }

        @Test
        @DisplayName("✅ Should set status to AVAILABLE when creating a product")
        void createProduct_SetsStatusToAvailable() {
            // ── ARRANGE ──
            when(userRepository.findByEmail("abhay@test.com"))
                    .thenReturn(Optional.of(testOwner));
            when(categoryRepository.findById(1L))
                    .thenReturn(Optional.of(testCategory));
            when(productRepository.save(any(Product.class)))
                    .thenReturn(testProduct);

            // WHY ArgumentCaptor: Capture the EXACT Product object passed to save()
            //     so we can inspect its fields. This is a KEY INTERVIEW CONCEPT.
            ArgumentCaptor<Product> productCaptor = ArgumentCaptor.forClass(Product.class);

            // ── ACT ──
            productService.createProduct("abhay@test.com", createRequest);

            // ── ASSERT ──
            verify(productRepository).save(productCaptor.capture());
            Product savedProduct = productCaptor.getValue();

            // WHY: Business rule — new products should always be AVAILABLE
            assertThat(savedProduct.getStatus()).isEqualTo(ProductStatus.AVAILABLE);
            assertThat(savedProduct.getOwner()).isEqualTo(testOwner);
            assertThat(savedProduct.getCategory()).isEqualTo(testCategory);
        }

        @Test
        @DisplayName("❌ Should throw UserNotFoundException when email doesn't exist")
        void createProduct_UserNotFound_ThrowsException() {
            // ── ARRANGE ──
            // WHY: Return empty Optional = user doesn't exist in DB
            when(userRepository.findByEmail("nonexistent@test.com"))
                    .thenReturn(Optional.empty());

            // ── ACT + ASSERT ──
            // WHY assertThatThrownBy: Tests that an exception IS thrown
            //     This is the UNHAPPY PATH — interviewers LOVE asking about this
            assertThatThrownBy(() ->
                    productService.createProduct("nonexistent@test.com", createRequest)
            )
                    .isInstanceOf(UserNotFoundException.class)
                    .hasMessage("user not found");

            // WHY: If user doesn't exist, we should NEVER try to save a product
            verify(productRepository, never()).save(any());
        }

        @Test
        @DisplayName("❌ Should throw CategoryNotFoundException when category doesn't exist")
        void createProduct_CategoryNotFound_ThrowsException() {
            // ── ARRANGE ──
            when(userRepository.findByEmail("abhay@test.com"))
                    .thenReturn(Optional.of(testOwner));
            when(categoryRepository.findById(1L))
                    .thenReturn(Optional.empty());

            // ── ACT + ASSERT ──
            assertThatThrownBy(() ->
                    productService.createProduct("abhay@test.com", createRequest)
            )
                    .isInstanceOf(CategoryNotFoundException.class)
                    .hasMessage("category not found");

            verify(productRepository, never()).save(any());
        }
    }

    // ═══════════════════════════════════════════════════════════════════════
    //  📗 TEST GROUP 2: updateProduct()
    // ═══════════════════════════════════════════════════════════════════════
    @Nested
    @DisplayName("updateProduct()")
    class UpdateProductTests {

        @Test
        @DisplayName("✅ Should update product successfully when owner matches")
        void updateProduct_Success() {
            // ── ARRANGE ──
            when(userRepository.findByEmail("abhay@test.com"))
                    .thenReturn(Optional.of(testOwner));
            when(productRepository.findById(1L))
                    .thenReturn(Optional.of(testProduct));
            when(categoryRepository.findById(1L))
                    .thenReturn(Optional.of(testCategory));
            when(productRepository.save(any(Product.class)))
                    .thenReturn(testProduct);

            // ── ACT ──
            ProductResponse result = productService.updateProduct(1L, "abhay@test.com", updateRequest);

            // ── ASSERT ──
            assertThat(result).isNotNull();

            // WHY: Verify that save was called — confirms update went through
            verify(productRepository).save(any(Product.class));
        }

        @Test
        @DisplayName("✅ Should update all fields correctly")
        void updateProduct_UpdatesAllFields() {
            // ── ARRANGE ──
            when(userRepository.findByEmail("abhay@test.com"))
                    .thenReturn(Optional.of(testOwner));
            when(productRepository.findById(1L))
                    .thenReturn(Optional.of(testProduct));
            when(categoryRepository.findById(1L))
                    .thenReturn(Optional.of(testCategory));
            when(productRepository.save(any(Product.class)))
                    .thenReturn(testProduct);

            ArgumentCaptor<Product> productCaptor = ArgumentCaptor.forClass(Product.class);

            // ── ACT ──
            productService.updateProduct(1L, "abhay@test.com", updateRequest);

            // ── ASSERT ──
            verify(productRepository).save(productCaptor.capture());
            Product updatedProduct = productCaptor.getValue();

            // WHY: Verify EVERY field is correctly set from the request
            assertThat(updatedProduct.getTitle()).isEqualTo("iPhone 15 Pro");
            assertThat(updatedProduct.getDescription()).isEqualTo("Updated iPhone");
            assertThat(updatedProduct.getPrice()).isEqualByComparingTo(BigDecimal.valueOf(1199.99));
            assertThat(updatedProduct.getQuantity()).isEqualTo(3);
            assertThat(updatedProduct.getCondition()).isEqualTo(ProductCondition.LIKE_NEW);
        }

        @Test
        @DisplayName("❌ Should throw UnauthorizedException when non-owner tries to update")
        void updateProduct_NotOwner_ThrowsUnauthorized() {
            // ── ARRANGE ──
            // WHY: anotherUser (id=2) tries to update testProduct owned by testOwner (id=1)
            when(userRepository.findByEmail("john@test.com"))
                    .thenReturn(Optional.of(anotherUser));
            when(productRepository.findById(1L))
                    .thenReturn(Optional.of(testProduct));

            // ── ACT + ASSERT ──
            // WHY: This tests AUTHORIZATION — a critical business rule!
            //      Only the product owner should be able to update it
            assertThatThrownBy(() ->
                    productService.updateProduct(1L, "john@test.com", updateRequest)
            )
                    .isInstanceOf(UnauthorizedException.class)
                    .hasMessage("You are not allowed to update this product");

            // WHY: Should NOT call save when unauthorized
            verify(productRepository, never()).save(any());
        }

        @Test
        @DisplayName("❌ Should throw ProductNotFoundException when product doesn't exist")
        void updateProduct_ProductNotFound_ThrowsException() {
            // ── ARRANGE ──
            when(userRepository.findByEmail("abhay@test.com"))
                    .thenReturn(Optional.of(testOwner));
            when(productRepository.findById(999L))
                    .thenReturn(Optional.empty());

            // ── ACT + ASSERT ──
            assertThatThrownBy(() ->
                    productService.updateProduct(999L, "abhay@test.com", updateRequest)
            )
                    .isInstanceOf(ProductNotFoundException.class)
                    .hasMessage("Product not found");
        }

        @Test
        @DisplayName("❌ Should throw UserNotFoundException when user doesn't exist")
        void updateProduct_UserNotFound_ThrowsException() {
            // ── ARRANGE ──
            when(userRepository.findByEmail("ghost@test.com"))
                    .thenReturn(Optional.empty());

            // ── ACT + ASSERT ──
            assertThatThrownBy(() ->
                    productService.updateProduct(1L, "ghost@test.com", updateRequest)
            )
                    .isInstanceOf(UserNotFoundException.class);
        }
    }

    // ═══════════════════════════════════════════════════════════════════════
    //  📗 TEST GROUP 3: deleteProduct()
    // ═══════════════════════════════════════════════════════════════════════
    @Nested
    @DisplayName("deleteProduct()")
    class DeleteProductTests {

        @Test
        @DisplayName("✅ Should delete product and all dependent records when owner matches")
        void deleteProduct_Success() {
            // ── ARRANGE ──
            when(userRepository.findByEmail("abhay@test.com"))
                    .thenReturn(Optional.of(testOwner));
            when(productRepository.findById(1L))
                    .thenReturn(Optional.of(testProduct));
            when(auctionRepository.findByProduct(testProduct))
                    .thenReturn(Optional.empty());

            // ── ACT ──
            productService.deleteProduct(1L, "abhay@test.com");

            // ── ASSERT ──
            // WHY: Verify ALL cleanup methods were called — this tests CASCADE deletion logic
            //      Interviewers ask: "How do you verify void methods?"
            //      Answer: use verify() — it checks the method was called
            verify(productRepository).deleteOffersByProductId(1L);
            verify(productRepository).deleteConversationsByProductId(1L);
            verify(productRepository).deleteReviewsByProductId(1L);
            verify(productRepository).deleteWishlistsByProductId(1L);
            verify(productRepository).delete(testProduct);
        }

        @Test
        @DisplayName("❌ Should throw UnauthorizedException when non-owner tries to delete")
        void deleteProduct_NotOwner_ThrowsUnauthorized() {
            // ── ARRANGE ──
            when(userRepository.findByEmail("john@test.com"))
                    .thenReturn(Optional.of(anotherUser));
            when(productRepository.findById(1L))
                    .thenReturn(Optional.of(testProduct));

            // ── ACT + ASSERT ──
            assertThatThrownBy(() ->
                    productService.deleteProduct(1L, "john@test.com")
            )
                    .isInstanceOf(UnauthorizedException.class);

            // WHY: If unauthorized, the product must NOT be deleted
            verify(productRepository, never()).delete(any(Product.class));
        }

        @Test
        @DisplayName("❌ Should throw ProductNotFoundException when product doesn't exist")
        void deleteProduct_ProductNotFound_ThrowsException() {
            // ── ARRANGE ──
            when(userRepository.findByEmail("abhay@test.com"))
                    .thenReturn(Optional.of(testOwner));
            when(productRepository.findById(999L))
                    .thenReturn(Optional.empty());

            // ── ACT + ASSERT ──
            assertThatThrownBy(() ->
                    productService.deleteProduct(999L, "abhay@test.com")
            )
                    .isInstanceOf(ProductNotFoundException.class);
        }
    }

    // ═══════════════════════════════════════════════════════════════════════
    //  📗 TEST GROUP 4: getMyProducts()
    // ═══════════════════════════════════════════════════════════════════════
    @Nested
    @DisplayName("getMyProducts()")
    class GetMyProductsTests {

        @Test
        @DisplayName("✅ Should return list of products for the owner")
        void getMyProducts_Success() {
            // ── ARRANGE ──
            when(userRepository.findByEmail("abhay@test.com"))
                    .thenReturn(Optional.of(testOwner));
            when(productRepository.findByOwner(testOwner))
                    .thenReturn(List.of(testProduct));

            // ── ACT ──
            List<ProductResponse> results = productService.getMyProducts("abhay@test.com");

            // ── ASSERT ──
            assertThat(results).hasSize(1);
            assertThat(results.get(0).getTitle()).isEqualTo("iPhone 15");
        }

        @Test
        @DisplayName("✅ Should return empty list when user has no products")
        void getMyProducts_EmptyList() {
            // ── ARRANGE ──
            when(userRepository.findByEmail("abhay@test.com"))
                    .thenReturn(Optional.of(testOwner));
            when(productRepository.findByOwner(testOwner))
                    .thenReturn(List.of());

            // ── ACT ──
            List<ProductResponse> results = productService.getMyProducts("abhay@test.com");

            // ── ASSERT ──
            // WHY: Always test EDGE CASES — empty list is different from null!
            assertThat(results).isEmpty();
        }

        @Test
        @DisplayName("❌ Should throw UserNotFoundException when user doesn't exist")
        void getMyProducts_UserNotFound_ThrowsException() {
            // ── ARRANGE ──
            when(userRepository.findByEmail("ghost@test.com"))
                    .thenReturn(Optional.empty());

            // ── ACT + ASSERT ──
            assertThatThrownBy(() ->
                    productService.getMyProducts("ghost@test.com")
            )
                    .isInstanceOf(UserNotFoundException.class);
        }
    }

    // ═══════════════════════════════════════════════════════════════════════
    //  📗 TEST GROUP 5: getProductById()
    // ═══════════════════════════════════════════════════════════════════════
    @Nested
    @DisplayName("getProductById()")
    class GetProductByIdTests {

        @Test
        @DisplayName("✅ Should return product details when product exists")
        void getProductById_Success() {
            // ── ARRANGE ──
            when(productRepository.findById(1L))
                    .thenReturn(Optional.of(testProduct));
            // The mapToProductDetailsResponse calls findByOwner for listingCount
            when(productRepository.findByOwner(testOwner))
                    .thenReturn(List.of(testProduct));

            // ── ACT ──
            ProductDetailsResponse result = productService.getProductById(1L);

            // ── ASSERT ──
            assertThat(result).isNotNull();
            assertThat(result.getId()).isEqualTo(1L);
            assertThat(result.getTitle()).isEqualTo("iPhone 15");
            assertThat(result.getDescription()).isEqualTo("Brand new iPhone");
            assertThat(result.getPrice()).isEqualByComparingTo(BigDecimal.valueOf(999.99));
            assertThat(result.getQuantity()).isEqualTo(5);
            assertThat(result.getCategory()).isEqualTo("Electronics");
            assertThat(result.getImages()).hasSize(1);
            assertThat(result.getImages().get(0)).isEqualTo("http://image.com/test.jpg");
        }

        @Test
        @DisplayName("❌ Should throw ProductNotFoundException when product doesn't exist")
        void getProductById_NotFound_ThrowsException() {
            // ── ARRANGE ──
            when(productRepository.findById(999L))
                    .thenReturn(Optional.empty());

            // ── ACT + ASSERT ──
            assertThatThrownBy(() ->
                    productService.getProductById(999L)
            )
                    .isInstanceOf(ProductNotFoundException.class)
                    .hasMessageContaining("Product not found with id: 999");
        }
    }

    // ═══════════════════════════════════════════════════════════════════════
    //  📗 TEST GROUP 6: searchProducts()
    // ═══════════════════════════════════════════════════════════════════════
    @Nested
    @DisplayName("searchProducts()")
    class SearchProductsTests {

        @Test
        @DisplayName("✅ Should return matching products for keyword")
        void searchProducts_Success() {
            // ── ARRANGE ──
            when(productRepository.findByTitleContainingIgnoreCaseAndStatus(
                    "iPhone", ProductStatus.AVAILABLE))
                    .thenReturn(List.of(testProduct));

            // ── ACT ──
            List<ProductResponse> results = productService.searchProducts("iPhone");

            // ── ASSERT ──
            assertThat(results).hasSize(1);
            assertThat(results.get(0).getTitle()).isEqualTo("iPhone 15");
        }

        @Test
        @DisplayName("✅ Should return empty list when no products match keyword")
        void searchProducts_NoMatch_ReturnsEmpty() {
            // ── ARRANGE ──
            when(productRepository.findByTitleContainingIgnoreCaseAndStatus(
                    "NonExistentProduct", ProductStatus.AVAILABLE))
                    .thenReturn(List.of());

            // ── ACT ──
            List<ProductResponse> results = productService.searchProducts("NonExistentProduct");

            // ── ASSERT ──
            assertThat(results).isEmpty();
        }
    }
}
