package com.harvesthub.controller;

import com.harvesthub.entity.Order;
import com.harvesthub.entity.User;
import com.harvesthub.repository.OrderRepository;
import com.harvesthub.repository.ProductRepository;
import com.harvesthub.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.*;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminController {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        long totalUsers = userRepository.count();
        long totalFarmers = userRepository.countByRole(User.Role.FARMER);
        long totalCustomers = userRepository.countByRole(User.Role.CUSTOMER);
        long totalProducts = productRepository.count();
        long totalOrders = orderRepository.count();

        List<Order> orders = orderRepository.findAll();
        BigDecimal totalSales = orders.stream()
                .filter(o -> o.getOrderStatus() != Order.Status.CANCELLED)
                .map(Order::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Map<String, Object> response = new HashMap<>();
        response.put("totalUsers", totalUsers);
        response.put("totalFarmers", totalFarmers);
        response.put("totalCustomers", totalCustomers);
        response.put("totalProducts", totalProducts);
        response.put("totalOrders", totalOrders);
        response.put("totalSales", totalSales);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @PatchMapping("/users/{id}/status")
    public ResponseEntity<User> toggleUserStatus(@PathVariable String id, @RequestBody Map<String, Boolean> body) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        if (body.containsKey("active")) {
            user.setActive(body.get("active"));
        } else {
            user.setActive(!user.isActive());
        }
        return ResponseEntity.ok(userRepository.save(user));
    }

    @GetMapping("/orders")
    public ResponseEntity<List<Order>> getAllOrders() {
        return ResponseEntity.ok(orderRepository.findAllByOrderByCreatedAtDesc());
    }
}
