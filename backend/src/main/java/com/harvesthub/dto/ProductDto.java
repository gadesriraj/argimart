package com.harvesthub.dto;

import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;

public class ProductDto {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CreateRequest {
        @NotBlank(message = "Product name is required")
        private String name;

        @NotBlank(message = "Description is required")
        private String description;

        @NotBlank(message = "Category is required")
        private String category;

        @NotNull(message = "Price is required")
        @DecimalMin(value = "0.01", message = "Price must be greater than zero")
        private BigDecimal price;

        @NotBlank(message = "Unit is required")
        private String unit;

        @Min(value = 0, message = "Stock quantity cannot be negative")
        private int stockQuantity;

        @NotBlank(message = "Image URL is required")
        private String imageUrl;

        @NotBlank(message = "Location is required")
        private String location;
    }
}
