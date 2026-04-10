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
        seedAdminUsers();
    }

    private void seedAdminUsers() {
        // Seed default system admin if it doesn't exist
        String defaultAdmin = "admin@example.com";
        if (userRepository.findByEmail(defaultAdmin).isEmpty()) {
            log.info("Seeding system admin user: {}", defaultAdmin);
            createUser(defaultAdmin, "admin123", "System", "Admin");
        }

        // Seed or promote the specifically configured admin email
        if (adminEmail != null && !adminEmail.equals(defaultAdmin)) {
            userRepository.findByEmail(adminEmail).ifPresentOrElse(
                user -> {
                    if (!user.getRoles().contains(com.ecommerce.model.User.Role.ADMIN)) {
                        user.getRoles().add(com.ecommerce.model.User.Role.ADMIN);
                        userRepository.save(user);
                        log.info("Promoted existing user {} to ADMIN role", adminEmail);
                    }
                },
                () -> {
                    log.info("Seeding configured admin account: {}", adminEmail);
                    createUser(adminEmail, adminPassword, "Admin", "Account");
                }
            );
        }

        log.info("Data seeding finished (Admin accounts verified).");
    }

    private void createUser(String email, String password, String firstName, String lastName) {
        com.ecommerce.model.User user = com.ecommerce.model.User.builder()
                .firstName(firstName)
                .lastName(lastName)
                .email(email)
                .password(passwordEncoder.encode(password))
                .roles(new HashSet<>(Arrays.asList(com.ecommerce.model.User.Role.ADMIN)))
                .active(true)
                .createdAt(LocalDateTime.now())
                .build();
        userRepository.save(user);
    }
}
