package com.ecommerce.config;

import com.ecommerce.model.Category;
import com.ecommerce.model.Product;
import com.ecommerce.repository.CategoryRepository;
import com.ecommerce.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Random;

@Component
@Slf4j
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final com.ecommerce.repository.UserRepository userRepository;
    private final org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    public void run(String... args) throws Exception {
        // Seed Admin User
        if (userRepository.findByEmail("admin@example.com").isEmpty()) {
            log.info("Seeding default admin user...");
            com.ecommerce.model.User admin = com.ecommerce.model.User.builder()
                    .firstName("Admin")
                    .lastName("User")
                    .email("admin@example.com")
                    .password(passwordEncoder.encode("admin123"))
                    .roles(new java.util.HashSet<>(java.util.Arrays.asList(com.ecommerce.model.User.Role.ADMIN)))
                    .active(true)
                    .createdAt(LocalDateTime.now())
                    .build();
            userRepository.save(admin);
        }
        // Ensure specific admin user exists and has ADMIN role
        userRepository.findByEmail("admin@gmail.com").ifPresentOrElse(
            admin -> {
                if (!admin.getRoles().contains(com.ecommerce.model.User.Role.ADMIN)) {
                    admin.getRoles().add(com.ecommerce.model.User.Role.ADMIN);
                    userRepository.save(admin);
                    log.info("Promoted existing user admin@gmail.com to ADMIN role");
                }
            },
            () -> {
                log.info("Seeding user's specific admin user...");
                com.ecommerce.model.User admin = com.ecommerce.model.User.builder()
                        .firstName("Admin")
                        .lastName("Account")
                        .email("admin@gmail.com")
                        .password(passwordEncoder.encode("@D9075134498m"))
                        .roles(new java.util.HashSet<>(java.util.Arrays.asList(com.ecommerce.model.User.Role.ADMIN)))
                        .active(true)
                        .createdAt(LocalDateTime.now())
                        .build();
                userRepository.save(admin);
                log.info("User's specific admin seeded: admin@gmail.com");
            }
        );

        long currentProductCount = productRepository.count();

        // Let's seed only if there are fewer than 100 products to prevent infinite seeding on restarts
        if (currentProductCount < 50) {
            log.info("Starting data seed for categories + products...");
            List<Category> categories = categoryRepository.findAll();

            if (categories.isEmpty()) {
                log.warn("No categories found in the database. Product seeding aborted.");
                return;
            }

            Random random = new Random();
            int idCounter = 1;

            for (Category category : categories) {
                log.info("Seeding 15 products for category: {}", category.getName());
                List<Product> productsToSave = new ArrayList<>();

                for (int i = 1; i <= 15; i++) {
                    int basePriceInt = 500 + random.nextInt(4500);
                    BigDecimal price = BigDecimal.valueOf(basePriceInt);
                    BigDecimal discountPrice = BigDecimal.valueOf((int) (basePriceInt * 0.8));
                    
                    String[] colors = {"Red", "Blue", "Black", "White", "Silver", "Gold"};
                    String randColor = colors[random.nextInt(colors.length)];

                    String categoryName = category.getName().toLowerCase();
                    String imageKeyword = categoryName.contains("electronic") ? "tech" : 
                                         categoryName.contains("fashion") ? "clothing" :
                                         categoryName.contains("home") ? "interior" :
                                         categoryName.contains("sport") ? "fitness" : categoryName;
                    
                    String imageUrl = String.format("https://images.unsplash.com/photo-%d?auto=format&fit=crop&q=80&w=800", 
                        1500000000000L + Math.abs(category.getName().hashCode()) + (long)i * 1234567L);


                    Product.ProductSpecs specs = Product.ProductSpecs.builder()
                            .weight("1.5 kg")
                            .dimensions("10x10x10 cm")
                            .color(randColor)
                            .material("Premium Mixed")
                            .warranty("1 Year")
                            .build();

                    Product product = Product.builder()
                            .name(category.getName() + " Premium Item " + i)
                            .description("This is a high-quality product in the " + category.getName() + " category. It features premium materials and excellent build quality, ensuring a long shelf life and great usability. Highly recommended for everyday use.")
                            .brand("Brand " + (random.nextInt(5) + 1))
                            .price(price)
                            .discountPrice(discountPrice)
                            .discountPercentage(20)
                            .categoryId(category.getId())
                            .categoryName(category.getName())
                            .images(Arrays.asList(imageUrl))
                            .stockQuantity(10 + random.nextInt(100))
                            .active(true)
                            .featured(random.nextDouble() > 0.8)
                            .averageRating(3.0 + (random.nextDouble() * 2))
                            .reviewCount(random.nextInt(500))
                            .tags(Arrays.asList(category.getName().toLowerCase(), "premium", "new arrival"))
                            .specs(specs)
                            .createdAt(LocalDateTime.now())
                            .updatedAt(LocalDateTime.now())
                            .build();

                    productsToSave.add(product);
                }

                productRepository.saveAll(productsToSave);
            }

            log.info("Seeding complete. New product count: {}", productRepository.count());
        } else {
            log.info("Database already contains enough products (Count: {}). Seeding skipped.", currentProductCount);
        }
    }
}
