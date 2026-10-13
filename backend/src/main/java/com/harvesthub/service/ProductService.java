package com.harvesthub.service;

import com.harvesthub.dto.ProductDto;
import com.harvesthub.entity.Product;
import com.harvesthub.entity.User;
import com.harvesthub.repository.ProductRepository;
import com.harvesthub.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public List<Product> getAllActiveProducts(String category, BigDecimal minPrice, BigDecimal maxPrice, String query) {
        return productRepository.searchProducts(category, minPrice, maxPrice, query);
    }

    public Product getProductById(String id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Product not found with id: " + id));
    }

    public List<Product> getProductsByFarmer(String farmerId) {
        return productRepository.findByFarmerId(farmerId);
    }

    @Transactional
    public Product createProduct(ProductDto.CreateRequest request, String currentUserId) {
        User farmer = userRepository.findById(currentUserId)
                .orElseThrow(() -> new IllegalArgumentException("Farmer not found"));

        Product product = Product.builder()
                .id("prod-" + UUID.randomUUID().toString().substring(0, 8))
                .name(request.getName())
                .description(request.getDescription())
                .category(request.getCategory())
                .price(request.getPrice())
                .unit(request.getUnit())
                .stockQuantity(request.getStockQuantity())
                .imageUrl(request.getImageUrl())
                .location(request.getLocation())
                .farmerId(farmer.getId())
                .farmerName(farmer.getFullName())
                .active(true)
                .rating(new BigDecimal("5.0"))
                .reviewsCount(0)
                .build();

        return productRepository.save(product);
    }

    @Transactional
    public Product updateProduct(String id, ProductDto.CreateRequest request, String currentUserId) {
        Product product = getProductById(id);

        // Security check: Only the owner farmer or an admin can edit
        if (!product.getFarmerId().equals(currentUserId)) {
            User user = userRepository.findById(currentUserId).orElse(null);
            if (user == null || user.getRole() != User.Role.ADMIN) {
                throw new SecurityException("Unauthorized to modify this product listing");
            }
        }

        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setCategory(request.getCategory());
        product.setPrice(request.getPrice());
        product.setUnit(request.getUnit());
        product.setStockQuantity(request.getStockQuantity());
        product.setImageUrl(request.getImageUrl());
        product.setLocation(request.getLocation());

        return productRepository.save(product);
    }

    @Transactional
    public void deleteProduct(String id, String currentUserId) {
        Product product = getProductById(id);

        if (!product.getFarmerId().equals(currentUserId)) {
            User user = userRepository.findById(currentUserId).orElse(null);
            if (user == null || user.getRole() != User.Role.ADMIN) {
                throw new SecurityException("Unauthorized to delete this product listing");
            }
        }

        productRepository.delete(product);
    }
}
