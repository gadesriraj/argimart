package com.harvesthub.service;

import com.harvesthub.dto.AuthDto;
import com.harvesthub.entity.Cart;
import com.harvesthub.entity.User;
import com.harvesthub.repository.CartRepository;
import com.harvesthub.repository.UserRepository;
import com.harvesthub.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final CartRepository cartRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    @Transactional
    public AuthDto.AuthResponse register(AuthDto.RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already registered: " + request.getEmail());
        }

        // Public registration security enforcement
        if (request.getRole() == User.Role.ADMIN) {
            throw new SecurityException("Public self-registration of ADMIN role is forbidden");
        }

        String userId = "user-" + UUID.randomUUID().toString().substring(0, 8);

        User user = User.builder()
                .id(userId)
                .fullName(request.getFullName())
                .email(request.getEmail().toLowerCase())
                .phone(request.getPhone())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .address(request.getAddress())
                .active(true)
                .build();

        userRepository.save(user);

        // If registered as customer, initialize an empty cart
        if (user.getRole() == User.Role.CUSTOMER) {
            Cart cart = Cart.builder()
                    .id("cart-" + UUID.randomUUID().toString().substring(0, 8))
                    .customerId(user.getId())
                    .build();
            cartRepository.save(cart);
        }

        String token = tokenProvider.generateToken(user.getId(), user.getEmail(), user.getRole().name());

        return AuthDto.AuthResponse.builder()
                .token(token)
                .user(mapToUserResponse(user))
                .build();
    }

    public AuthDto.AuthResponse login(AuthDto.LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail().toLowerCase())
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new IllegalArgumentException("Invalid email or password");
        }

        if (!user.isActive()) {
            throw new IllegalStateException("Account has been deactivated. Please contact support.");
        }

        String token = tokenProvider.generateToken(user.getId(), user.getEmail(), user.getRole().name());

        return AuthDto.AuthResponse.builder()
                .token(token)
                .user(mapToUserResponse(user))
                .build();
    }

    public AuthDto.UserResponse mapToUserResponse(User user) {
        return AuthDto.UserResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .role(user.getRole().name())
                .address(user.getAddress())
                .active(user.isActive())
                .createdAt(user.getCreatedAt() != null ? user.getCreatedAt().toString() : "")
                .build();
    }
}
