package com.harvesthub.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;
import java.util.List;

public class AiDto {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AskRequest {
        @NotBlank(message = "Question is required")
        private String question;
        private String userRole;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class AskResponse {
        private String answer;
        private String category;
        private List<String> recommendedProductIds;
    }
}
