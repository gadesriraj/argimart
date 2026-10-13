package com.harvesthub.service;

import com.harvesthub.dto.AiDto;
import com.harvesthub.entity.AIConversation;
import com.harvesthub.repository.AIConversationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
@RequiredArgsConstructor
public class AiAssistantService {

    private final AIConversationRepository conversationRepository;

    @Value("${gemini.api.key:}")
    private String geminiApiKey;

    @Value("${gemini.api.url:https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent}")
    private String geminiApiUrl;

    public AiDto.AskResponse consultAgronomist(AiDto.AskRequest request, String userId) {
        String question = request.getQuestion();
        String answer;
        String category = "General Agronomy";

        if (geminiApiKey != null && !geminiApiKey.isBlank()) {
            try {
                RestTemplate restTemplate = new RestTemplate();
                String url = geminiApiUrl + "?key=" + geminiApiKey;

                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_JSON);

                String systemContext = "You are HarvestHub AI Agriculture Assistant, an expert agronomist providing guidance on Indian farming, seeds, soils, organic fertilizers, and drip irrigation.";
                Map<String, Object> part = Map.of("text", systemContext + "\nUser question: " + question);
                Map<String, Object> contents = Map.of("parts", List.of(part));
                Map<String, Object> requestBody = Map.of("contents", List.of(contents));

                HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
                ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);

                answer = extractCandidateText(response.getBody());
            } catch (Exception ex) {
                answer = getFallbackAgronomyAnswer(question);
            }
        } else {
            answer = getFallbackAgronomyAnswer(question);
        }

        // Save conversation history
        AIConversation conversation = AIConversation.builder()
                .id("ai-" + UUID.randomUUID().toString().substring(0, 8))
                .userId(userId)
                .question(question)
                .response(answer)
                .category(category)
                .build();
        conversationRepository.save(conversation);

        return AiDto.AskResponse.builder()
                .answer(answer)
                .category(category)
                .recommendedProductIds(List.of())
                .build();
    }

    private String extractCandidateText(Map responseBody) {
        if (responseBody != null && responseBody.containsKey("candidates")) {
            List candidates = (List) responseBody.get("candidates");
            if (!candidates.isEmpty()) {
                Map first = (Map) candidates.get(0);
                Map content = (Map) first.get("content");
                List parts = (List) content.get("parts");
                if (!parts.isEmpty()) {
                    Map part = (Map) parts.get(0);
                    return (String) part.get("text");
                }
            }
        }
        return "Guidance generated successfully.";
    }

    private String getFallbackAgronomyAnswer(String question) {
        String q = question.toLowerCase();
        if (q.contains("soil") || q.contains("fertilizer")) {
            return "Maintain soil testing every 2-3 seasons. Apply organic vermicompost to boost microbial populations and balance NPK application with split doses.";
        } else if (q.contains("irrigation") || q.contains("water")) {
            return "Precision drip irrigation delivers 50-60% water conservation directly into plant rootzones, inhibiting weed expansion.";
        }
        return "Select certified seed varieties (HD-2967 Wheat, Pusa 1121 Paddy) and employ Integrated Pest Management (IPM) using cold-pressed neem oil sprays.";
    }
}
