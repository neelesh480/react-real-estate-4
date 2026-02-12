package com.marketplace.service;

import com.marketplace.dto.gemini.GeminiRequest;
import com.marketplace.dto.gemini.GeminiResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class AIService {

    @Value("${google.gemini.api.url}")
    private String apiUrl;

    @Value("${google.gemini.api.key}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    public String generatePropertyDescription(String propertyDetails) {
        String prompt = "Act as a professional real estate agent. Write a compelling, " +
                        "marketing-style description (max 100 words) for a property with these details: " + 
                        propertyDetails;

        GeminiRequest request = new GeminiRequest(prompt);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        
        String urlWithKey = apiUrl + "?key=" + apiKey;

        HttpEntity<GeminiRequest> entity = new HttpEntity<>(request, headers);
        
        try {
            GeminiResponse response = restTemplate.postForObject(urlWithKey, entity, GeminiResponse.class);
            
            if (response != null && response.getCandidates() != null && !response.getCandidates().isEmpty()) {
                return response.getCandidates().get(0).getContent().getParts().get(0).getText();
            }
        } catch (Exception e) {
            e.printStackTrace();
            return "Error generating description: " + e.getMessage();
        }
        
        return "No description generated.";
    }
}