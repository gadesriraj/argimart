package com.harvesthub.controller;

import com.harvesthub.dto.AiDto;
import com.harvesthub.service.AiAssistantService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AiController {

    private final AiAssistantService aiAssistantService;

    @PostMapping("/ask")
    public ResponseEntity<AiDto.AskResponse> askAgronomist(
            @Valid @RequestBody AiDto.AskRequest request,
            Authentication authentication) {
        String userId = authentication != null ? authentication.getName() : "anonymous-user";
        return ResponseEntity.ok(aiAssistantService.consultAgronomist(request, userId));
    }
}
