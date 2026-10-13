package com.harvesthub.dto;

import com.harvesthub.entity.Order;
import jakarta.validation.constraints.*;
import lombok.*;

public class OrderDto {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CreateRequest {
        @NotBlank(message = "Delivery address is required")
        private String deliveryAddress;

        @NotBlank(message = "Contact phone is required")
        private String contactPhone;

        @NotBlank(message = "Payment method is required")
        private String paymentMethod;

        private String notes;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class StatusUpdateRequest {
        @NotNull(message = "Status is required")
        private Order.Status status;
    }
}
