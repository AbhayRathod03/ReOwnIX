package com.reownix.product.service.impl;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

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

import com.reownix.product.dto.request.CreateCategoryRequest;
import com.reownix.product.dto.request.UpdateCategoryRequest;
import com.reownix.product.dto.response.CategoryResponse;
import com.reownix.product.entity.Category;
import com.reownix.product.exception.CategoryNotFoundException;
import com.reownix.product.repository.CategoryRepository;

/**
 * ============================================================================
 *  UNIT TESTS for CategoryServiceImpl
 * ============================================================================
 *
 *  📖 INTERVIEW TIP: CategoryService is a SIMPLER service — no ownership checks.
 *     Perfect to show you understand CRUD testing at a basic level.
 *     Interviewers might start with simple services, then move to complex ones.
 *
 *  🔑 CONCEPTS REINFORCED:
 *     - Mocking a single repository
 *     - Testing simple CRUD operations
 *     - @Nested test grouping
 *     - Edge cases (empty list, not found)
 * ============================================================================
 */
@ExtendWith(MockitoExtension.class)
class CategoryServiceImplTest {

    @Mock
    private CategoryRepository categoryRepository;

    @InjectMocks
    private CategoryServiceImpl categoryService;

    private Category testCategory;
    private CreateCategoryRequest createRequest;
    private UpdateCategoryRequest updateRequest;

    @BeforeEach
    void setUp() {
        testCategory = Category.builder()
                .id(1L)
                .name("Electronics")
                .description("Electronic gadgets and devices")
                .build();

        createRequest = CreateCategoryRequest.builder()
                .name("Electronics")
                .description("Electronic gadgets and devices")
                .build();

        updateRequest = UpdateCategoryRequest.builder()
                .name("Updated Electronics")
                .description("Updated description")
                .build();
    }

    // ═══════════════════════════════════════════════════════════════════════
    //  📗 createCategory()
    // ═══════════════════════════════════════════════════════════════════════
    @Nested
    @DisplayName("createCategory()")
    class CreateCategoryTests {

        @Test
        @DisplayName("✅ Should create category successfully")
        void createCategory_Success() {
            // ── ARRANGE ──
            when(categoryRepository.save(any(Category.class)))
                    .thenReturn(testCategory);

            // ── ACT ──
            CategoryResponse result = categoryService.createCategory(createRequest);

            // ── ASSERT ──
            assertThat(result).isNotNull();
            assertThat(result.getName()).isEqualTo("Electronics");
            assertThat(result.getDescription()).isEqualTo("Electronic gadgets and devices");

            // WHY: Verify save was called — confirms the repo interaction happened
            verify(categoryRepository).save(any(Category.class));
        }

        @Test
        @DisplayName("✅ Should pass correct values to repository")
        void createCategory_CorrectValuesPassedToRepo() {
            // ── ARRANGE ──
            when(categoryRepository.save(any(Category.class)))
                    .thenReturn(testCategory);

            // WHY ArgumentCaptor: Capture WHAT was saved to verify field mapping
            ArgumentCaptor<Category> captor = ArgumentCaptor.forClass(Category.class);

            // ── ACT ──
            categoryService.createCategory(createRequest);

            // ── ASSERT ──
            verify(categoryRepository).save(captor.capture());
            Category savedCategory = captor.getValue();

            assertThat(savedCategory.getName()).isEqualTo("Electronics");
            assertThat(savedCategory.getDescription()).isEqualTo("Electronic gadgets and devices");
        }
    }

    // ═══════════════════════════════════════════════════════════════════════
    //  📗 updateCategory()
    // ═══════════════════════════════════════════════════════════════════════
    @Nested
    @DisplayName("updateCategory()")
    class UpdateCategoryTests {

        @Test
        @DisplayName("✅ Should update category when it exists")
        void updateCategory_Success() {
            // ── ARRANGE ──
            when(categoryRepository.findById(1L))
                    .thenReturn(Optional.of(testCategory));
            when(categoryRepository.save(any(Category.class)))
                    .thenReturn(testCategory);

            // ── ACT ──
            CategoryResponse result = categoryService.updateCategory(1L, updateRequest);

            // ── ASSERT ──
            assertThat(result).isNotNull();
            verify(categoryRepository).save(any(Category.class));
        }

        @Test
        @DisplayName("❌ Should throw CategoryNotFoundException when category doesn't exist")
        void updateCategory_NotFound_ThrowsException() {
            // ── ARRANGE ──
            when(categoryRepository.findById(999L))
                    .thenReturn(Optional.empty());

            // ── ACT + ASSERT ──
            assertThatThrownBy(() ->
                    categoryService.updateCategory(999L, updateRequest)
            )
                    .isInstanceOf(CategoryNotFoundException.class)
                    .hasMessage("Category not found");

            verify(categoryRepository, never()).save(any());
        }
    }

    // ═══════════════════════════════════════════════════════════════════════
    //  📗 deleteCategory()
    // ═══════════════════════════════════════════════════════════════════════
    @Nested
    @DisplayName("deleteCategory()")
    class DeleteCategoryTests {

        @Test
        @DisplayName("✅ Should delete category when it exists")
        void deleteCategory_Success() {
            // ── ARRANGE ──
            when(categoryRepository.findById(1L))
                    .thenReturn(Optional.of(testCategory));

            // ── ACT ──
            categoryService.deleteCategory(1L);

            // ── ASSERT ──
            // WHY: For void methods, verify() is the ONLY way to assert behavior
            verify(categoryRepository).delete(testCategory);
        }

        @Test
        @DisplayName("❌ Should throw CategoryNotFoundException when category doesn't exist")
        void deleteCategory_NotFound_ThrowsException() {
            // ── ARRANGE ──
            when(categoryRepository.findById(999L))
                    .thenReturn(Optional.empty());

            // ── ACT + ASSERT ──
            assertThatThrownBy(() ->
                    categoryService.deleteCategory(999L)
            )
                    .isInstanceOf(CategoryNotFoundException.class);

            verify(categoryRepository, never()).delete(any());
        }
    }

    // ═══════════════════════════════════════════════════════════════════════
    //  📗 getAllCategories()
    // ═══════════════════════════════════════════════════════════════════════
    @Nested
    @DisplayName("getAllCategories()")
    class GetAllCategoriesTests {

        @Test
        @DisplayName("✅ Should return all categories")
        void getAllCategories_Success() {
            // ── ARRANGE ──
            Category secondCategory = Category.builder()
                    .id(2L)
                    .name("Fashion")
                    .description("Clothing and accessories")
                    .build();

            when(categoryRepository.findAll())
                    .thenReturn(List.of(testCategory, secondCategory));

            // ── ACT ──
            List<CategoryResponse> results = categoryService.getAllCategories();

            // ── ASSERT ──
            assertThat(results).hasSize(2);
            assertThat(results.get(0).getName()).isEqualTo("Electronics");
            assertThat(results.get(1).getName()).isEqualTo("Fashion");
        }

        @Test
        @DisplayName("✅ Should return empty list when no categories exist")
        void getAllCategories_Empty() {
            // ── ARRANGE ──
            when(categoryRepository.findAll())
                    .thenReturn(List.of());

            // ── ACT ──
            List<CategoryResponse> results = categoryService.getAllCategories();

            // ── ASSERT ──
            assertThat(results).isEmpty();
        }
    }

    // ═══════════════════════════════════════════════════════════════════════
    //  📗 getCategoryById()
    // ═══════════════════════════════════════════════════════════════════════
    @Nested
    @DisplayName("getCategoryById()")
    class GetCategoryByIdTests {

        @Test
        @DisplayName("✅ Should return category when it exists")
        void getCategoryById_Success() {
            // ── ARRANGE ──
            when(categoryRepository.findById(1L))
                    .thenReturn(Optional.of(testCategory));

            // ── ACT ──
            CategoryResponse result = categoryService.getCategoryById(1L);

            // ── ASSERT ──
            assertThat(result).isNotNull();
            assertThat(result.getId()).isEqualTo(1L);
            assertThat(result.getName()).isEqualTo("Electronics");
        }

        @Test
        @DisplayName("❌ Should throw CategoryNotFoundException when not found")
        void getCategoryById_NotFound_ThrowsException() {
            // ── ARRANGE ──
            when(categoryRepository.findById(999L))
                    .thenReturn(Optional.empty());

            // ── ACT + ASSERT ──
            assertThatThrownBy(() ->
                    categoryService.getCategoryById(999L)
            )
                    .isInstanceOf(CategoryNotFoundException.class)
                    .hasMessage("Category not found");
        }
    }
}
