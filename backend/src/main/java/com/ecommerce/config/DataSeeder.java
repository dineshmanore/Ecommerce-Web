package com.ecommerce.config;

import com.ecommerce.repository.UserRepository;
import com.ecommerce.repository.CategoryRepository;
import com.ecommerce.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import java.time.LocalDateTime;
import java.util.HashSet;

@Component
@Slf4j
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;

    @Value("${admin.email:admin@gmail.com}")
    private String adminEmail;

    @Value("${admin.password:admin123}")
    private String adminPassword;

    public void run(String... args) throws Exception {
        seedAdminUsers();
        seedCategoriesAndProducts();
    }

    private void seedAdminUsers() {
        // Seed Default Admin User
        if (userRepository.findByEmail("admin@example.com").isEmpty()) {
            log.info("Seeding system admin user...");
            com.ecommerce.model.User admin = com.ecommerce.model.User.builder()
                    .firstName("System")
                    .lastName("Admin")
                    .email("admin@example.com")
                    .password(passwordEncoder.encode("admin123"))
                    .roles(new HashSet<>(java.util.Arrays.asList(com.ecommerce.model.User.Role.ADMIN)))
                    .active(true)
                    .createdAt(LocalDateTime.now())
                    .build();
            userRepository.save(admin);
        }

        // Ensure specific admin user exists and has ADMIN role
        userRepository.findByEmail(adminEmail).ifPresentOrElse(
            user -> {
                if (!user.getRoles().contains(com.ecommerce.model.User.Role.ADMIN)) {
                    user.getRoles().add(com.ecommerce.model.User.Role.ADMIN);
                    userRepository.save(user);
                    log.info("Promoted existing user {} to ADMIN role", adminEmail);
                }
            },
            () -> {
                log.info("Seeding user's specific admin user: {}", adminEmail);
                com.ecommerce.model.User admin = com.ecommerce.model.User.builder()
                        .firstName("Admin")
                        .lastName("Account")
                        .email(adminEmail)
                        .password(passwordEncoder.encode(adminPassword))
                        .roles(new HashSet<>(java.util.Arrays.asList(com.ecommerce.model.User.Role.ADMIN)))
                        .active(true)
                        .createdAt(LocalDateTime.now())
                        .build();
                userRepository.save(admin);
                log.info("User's specific admin seeded: {}", adminEmail);
            }
        );
    }

    private void seedCategoriesAndProducts() {
        if (categoryRepository.count() > 0) {
            log.info("Categories already exist, skipping category/product seeding.");
            return;
        }

        log.info("Seeding categories and real products...");

        // --- ELECTRONICS ---
        com.ecommerce.model.Category electronics = createCategory("Electronics", "electronics", 
            "Latest gadgets, smartphones, and accessories.", "https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=2070");
        
        seedProducts(electronics, java.util.Arrays.asList(
            createProduct("Apple iPhone 15 Pro", "The ultimate iPhone with titanium design and A17 Pro chip.", 134900, 
                "https://images.unsplash.com/photo-1696446701796-da61225697cc?q=80&w=2070", "Natural Titanium", "128GB", "A17 Pro Chip"),
            createProduct("Sony WH-1000XM5", "Industry-leading noise cancelling headphones with exceptional sound.", 29990, 
                "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=1976", "Black", "Noise-Cancelling", "30h Battery"),
            createProduct("MacBook Air M2", "Amazingly thin and fast, the most popular laptop in the world.", 114900, 
                "https://images.unsplash.com/photo-1611186871348-b1ec696e52c9?q=80&w=2070", "Midnight", "256GB SSD", "M2 Chip"),
            createProduct("Samsung Galaxy Watch 6", "Advanced health tracking and sleep coaching features.", 32999, 
                "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1999", "Graphite", "44mm", "AMOLED Screen"),
            createProduct("Dell UltraSharp 27 Monitor", "Experience pure performance and clarity with 4K resolution.", 45000, 
                "https://images.unsplash.com/photo-1547119957-637f8679db1e?q=80&w=1964", "Silver", "27 Inch", "4K Display")
        ));

        // --- FASHION ---
        com.ecommerce.model.Category fashion = createCategory("Fashion", "fashion", 
            "Trendy apparel, footwear, and designer collections.", "https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=2071");

        seedProducts(fashion, java.util.Arrays.asList(
            createProduct("Levi's 501 Original Jeans", "The original blue jeans since 1873, straight leg and iconic style.", 4599, 
                "https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=1926", "Dark Indigo", "Denim", "Button Fly"),
            createProduct("Nike Air Jordan 1", "The legendary sneaker that started it all, premium leather and cushioning.", 15995, 
                "https://images.unsplash.com/photo-1552346154-21d328109a27?q=80&w=2070", "Red/White", "Leather", "High Top"),
            createProduct("Ralph Lauren Oxford Shirt", "Classic slim-fit cotton shirt, an essential piece for any wardrobe.", 8500, 
                "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=1888", "Sky Blue", "100% Cotton", "Slim Fit"),
            createProduct("Ray-Ban Aviator Classic", "Iconic sunglasses with gold frame and green G-15 lenses.", 10990, 
                "https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=2080", "Gold/Green", "Glass", "UV Protection"),
            createProduct("Adidas Originals Hoodie", "Soft fleece hoodie with Trefoil logo on the chest.", 5999, 
                "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1887", "Black", "Fleece", "Kangaroo Pocket")
        ));

        // --- HOME & KITCHEN ---
        com.ecommerce.model.Category home = createCategory("Home", "home-and-kitchen", 
            "Furniture, appliances, and home decoration items.", "https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=2074");

        seedProducts(home, java.util.Arrays.asList(
            createProduct("Nespresso Vertuo Pop", "Compact coffee machine for five cup sizes and easy brewing.", 12900, 
                "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?q=80&w=2076", "Pacific Blue", "Coffee Pods", "Automatic"),
            createProduct("Dyson V15 Detect", "The most powerful, intelligent cordless vacuum with laser illumination.", 65900, 
                "https://images.unsplash.com/photo-1558317374-067fb5f30001?q=80&w=1770", "Yellow/Nickel", "Cordless", "HEPA Filtration"),
            createProduct("Instant Pot Duo 7-in-1", "Electric pressure cooker that slow cooks, sautés, and makes yogurt.", 9999, 
                "https://images.unsplash.com/photo-1544233726-b2b3ad936f31?q=80&w=2070", "Stainless Steel", "6 Litre", "Multi-Functional"),
            createProduct("Philips Air Fryer XL", "Healthy frying with Rapid Air technology and 1.2kg capacity.", 18500, 
                "https://images.unsplash.com/photo-1626074353765-517a681e40be?q=80&w=1887", "Black", "Air Fryer", "Digital Display"),
            createProduct("Le Creuset Dutch Oven", "Iconic enameled cast iron round casserole for slow-cooking.", 28000, 
                "https://images.unsplash.com/photo-1584281722573-f1f41d99049a?q=80&w=2070", "Volcanic", "4.2 Litre", "Cast Iron")
        ));

        // --- SPORTS & OUTDOORS ---
        com.ecommerce.model.Category sports = createCategory("Sports", "sports-and-outdoors", 
            "Fitness equipment and outdoor adventure gear.", "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070");

        seedProducts(sports, java.util.Arrays.asList(
            createProduct("Wilson Basketball NBA", "Official game ball feel for indoor and outdoor play.", 2499, 
                "https://images.unsplash.com/photo-1519861531473-9200262188bf?q=80&w=2071", "Orange", "Standard", "Grip Texture"),
            createProduct("Yoga Mat Premium", "Eco-friendly, non-slip mat with extra cushioning for joints.", 3500, 
                "https://images.unsplash.com/photo-1592419044706-39796d40f98c?q=80&w=1925", "Sage Green", "TPE", "6mm"),
            createProduct("The North Face Backpack", "Classic 28-liter backpack redesigned with more functional storage.", 8900, 
                "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?q=80&w=1886", "TNF Black", "Nylon", "28 Litre"),
            createProduct("Garmin Forerunner 255", "Advanced GPS running smartwatch with training load and status.", 34500, 
                "https://images.unsplash.com/photo-1523395243481-163f8f6155ab?q=80&w=1887", "Slate Grey", "GPS", "Music Storage"),
            createProduct("Trek Mountain Bike", "Performance hardtail with internal routing and lockout fork.", 42000, 
                "https://images.unsplash.com/photo-1485965120184-e220f721d03e?q=80&w=2070", "Azure Blue", "Aluminum", "21-Speed")
        ));

        // --- BEAUTY & PERSONAL CARE ---
        com.ecommerce.model.Category beauty = createCategory("Beauty", "beauty-and-personal-care", 
            "Elite skincare, makeup, and grooming products.", "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1787");

        seedProducts(beauty, java.util.Arrays.asList(
            createProduct("Dior Sauvage Parfum", "A masculine fragrance inspired by wide-open spaces and raw power.", 14500, 
                "https://images.unsplash.com/photo-1541605028087-329cc3bf5132?q=80&w=1964", "Midnight", "Ea De Parfum", "100ml"),
            createProduct("Estée Lauder Serum", "Advanced Night Repair synchronous multi-recovery complex.", 8900, 
                "https://images.unsplash.com/photo-1620916566398-39f1143878b1?q=80&w=1887", "Amber", "Serum", "50ml"),
            createProduct("Gyson Airwrap Styler", "Dry, curl, wave, and smooth without extreme heat damage.", 46000, 
                "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=1935", "Prussian Blue", "Styling Set", "V9 Motor"),
            createProduct("Oral-B iO Series 9", "Electronic toothbrush with AI tracking and 3D visual coaching.", 18900, 
                "https://images.unsplash.com/photo-1559591937-e68fb833df37?q=80&w=2071", "Black Onyx", "Magnetic", "7 Modes"),
            createProduct("Chanel No. 5", "The essence of femininity, a timeless, legendary floral fragrance.", 12500, 
                "https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=2070", "Cloudy", "Floral", "50ml")
        ));

        log.info("Database seeding finished successfully.");
    }

    private com.ecommerce.model.Category createCategory(String name, String slug, String description, String image) {
        com.ecommerce.model.Category category = com.ecommerce.model.Category.builder()
            .name(name)
            .slug(slug)
            .description(description)
            .image(image)
            .active(true)
            .createdAt(LocalDateTime.now())
            .build();
        return categoryRepository.save(category);
    }

    private com.ecommerce.model.Product createProduct(String name, String desc, double price, String img, String color, String size, String material) {
        return com.ecommerce.model.Product.builder()
            .name(name)
            .description(desc)
            .price(new java.math.BigDecimal(price))
            .images(java.util.Collections.singletonList(img))
            .stockQuantity(100)
            .active(true)
            .featured(true)
            .averageRating(4.5)
            .reviewCount(java.util.concurrent.ThreadLocalRandom.current().nextInt(50, 500))
            .specs(com.ecommerce.model.Product.ProductSpecs.builder()
                .color(color)
                .material(material)
                .weight(size)
                .build())
            .createdAt(LocalDateTime.now())
            .build();
    }

    private void seedProducts(com.ecommerce.model.Category cat, java.util.List<com.ecommerce.model.Product> products) {
        products.forEach(p -> {
            p.setCategoryId(cat.getId());
            p.setCategoryName(cat.getName());
            productRepository.save(p);
        });
    }
}
