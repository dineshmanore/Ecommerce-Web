package com.ecommerce.config;

import com.ecommerce.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Arrays;

@Component
@Slf4j
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${admin.email:admin@gmail.com}")
    private String adminEmail;

    @Value("${admin.password:admin123}")
    private String adminPassword;

    public void run(String... args) throws Exception {
        // Seed Default Admin User
        if (userRepository.findByEmail("admin@example.com").isEmpty()) {
            log.info("Seeding system admin user...");
            com.ecommerce.model.User admin = com.ecommerce.model.User.builder()
                    .firstName("System")
                    .lastName("Admin")
                    .email("admin@example.com")
                    .password(passwordEncoder.encode("admin123"))
                    .roles(new HashSet<>(Arrays.asList(com.ecommerce.model.User.Role.ADMIN)))
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
                        .roles(new HashSet<>(Arrays.asList(com.ecommerce.model.User.Role.ADMIN)))
                        .active(true)
                        .createdAt(LocalDateTime.now())
                        .build();
                userRepository.save(admin);
                log.info("User's specific admin seeded: {}", adminEmail);
            }
        );

        log.info("Data seeding finished (Admin accounts verified).");
    }
}
