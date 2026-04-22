package com.ecommerce.ecommerce_backen.AI.Service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
public class GeminiService {

    @Value("${gemini.api.key}")
    private String apiKey;

    public String ask(String prompt) {
        // En güncel ve hızlı flash modelini kullanıyoruz
        String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite-preview:generateContent?key=" + apiKey;

        try {
            RestTemplate rest = new RestTemplate();
            ObjectMapper mapper = new ObjectMapper();

            // Gemini'ın beklediği JSON body yapısı
            Map<String, Object> body = Map.of(
                    "contents", List.of(
                            Map.of("parts", List.of(
                                    Map.of("text", prompt)
                            ))
                    )
            );

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<String> entity = new HttpEntity<>(mapper.writeValueAsString(body), headers);
            ResponseEntity<String> response = rest.postForEntity(url, entity, String.class);

            JsonNode root = mapper.readTree(response.getBody());

            // Botun düzelttiği ve patlamayan o meşhur JSON path'i
            return root.path("candidates")
                    .path(0)
                    .path("content")
                    .path("parts")
                    .path(0)
                    .path("text")
                    .asText();

        } catch (Exception e) {
            return "Error calling Gemini API: " + e.getMessage();
        }
    }
}