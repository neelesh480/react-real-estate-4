package com.marketplace.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.marketplace.dto.gemini.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
public class AIService {

    @Value("${google.gemini.api.url}")
    private String apiUrl;

    @Value("${google.gemini.api.key}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public String generatePropertyDescription(String propertyDetails) {
        String prompt = "Act as a professional real estate agent. Write a compelling, " +
                        "marketing-style description (max 100 words) for a property with these details: " +
                        propertyDetails;
        return getGeminiResponse(prompt);
    }

    public String generateChatResponse(String question) {
        String prompt = "You are a helpful real estate assistant. Answer the following question concisely: " + question;
        return getGeminiResponse(prompt);
    }

    public Map<String, Object> extractSearchCriteria(String query) {
        String prompt = "From the following user query, extract real estate search criteria. " +
                        "Respond ONLY with a JSON object containing keys like 'location', 'minPrice', and 'maxPrice'. " +
                        "If a value is not mentioned, omit the key. For price, use only numbers. " +
                        "For example, 'under 500k' should be '{\"maxPrice\": 500000}'. " +
                        "Query: " + query;

        String jsonResponse = getGeminiResponse(prompt);
        return parseJsonResponse(jsonResponse);
    }

    public String generateNeighborhoodReport(String location) {
        String prompt = "You are a local guide. Write a brief, engaging summary for a potential homebuyer " +
                        "about the neighborhood around " + location + ". Highlight the lifestyle, nearby parks, " +
                        "schools, and shopping amenities. Keep the tone positive and informative. " +
                        "Format the response in Markdown with headings for each section.";
        return getGeminiResponse(prompt);
    }

    public Map<String, Object> extractCriteriaFromImage(String base64Image, String mimeType) {
        String prompt = "Analyze this image of a property. Identify the architectural style (e.g., modern, victorian), " +
                        "key features (e.g., pool, garden, large windows), and estimated price range based on visual cues. " +
                        "Respond ONLY with a JSON object containing keys: 'style', 'features' (array of strings), " +
                        "and 'estimatedPriceRange' (string).";

        GeminiRequest request = new GeminiRequest();
        Content content = new Content();
        content.addPart(new Part(prompt));
        
        InlineData inlineData = new InlineData();
        inlineData.setMimeType(mimeType);
        inlineData.setData(base64Image);
        
        Part imagePart = new Part();
        imagePart.setInlineData(inlineData);
        content.addPart(imagePart);
        
        request.addContent(content);

        String jsonResponse = sendGeminiRequest(request);
        return parseJsonResponse(jsonResponse);
    }

    public String generateInteriorDesignAdvice(String base64Image, String mimeType, String style) {
        String prompt = "Act as a professional interior designer. Analyze this room and provide a detailed design plan " +
                        "to transform it into a '" + style + "' style. Suggest a color palette (with hex codes), " +
                        "furniture layout, and specific decor items. Format the response in Markdown with clear headings.";

        GeminiRequest request = new GeminiRequest();
        Content content = new Content();
        content.addPart(new Part(prompt));
        
        InlineData inlineData = new InlineData();
        inlineData.setMimeType(mimeType);
        inlineData.setData(base64Image);
        
        Part imagePart = new Part();
        imagePart.setInlineData(inlineData);
        content.addPart(imagePart);
        
        request.addContent(content);

        return sendGeminiRequest(request);
    }

    public Map<String, Object> generateInvestmentAnalysis(String propertyDetails) {
        String prompt = "Act as a real estate investment analyst. Analyze the following property details and provide a financial report. " +
                        "Details: " + propertyDetails + ". " +
                        "Respond ONLY with a JSON object containing the following keys: " +
                        "'rentalYield' (string, e.g., '4.5%'), " +
                        "'cashFlow' (string, e.g., 'Positive'), " +
                        "'appreciationForecast' (string, e.g., '15% over 5 years'), " +
                        "'riskAssessment' (string, e.g., 'Low risk due to...'), " +
                        "and 'investmentRating' (string, e.g., 'Buy', 'Hold', or 'Pass').";

        String jsonResponse = getGeminiResponse(prompt);
        return parseJsonResponse(jsonResponse);
    }

    public String generateOfferLetter(String propertyDetails, String offerAmount, String userConditions) {
        String prompt = "Act as a professional real estate agent. Write a persuasive offer letter for a property with these details: " +
                        propertyDetails + ". The offer amount is " + offerAmount + ". " +
                        "Include the following conditions/notes from the buyer: " + userConditions + ". " +
                        "The tone should be professional yet personal. Format the letter clearly.";
        return getGeminiResponse(prompt);
    }

    public String summarizeLegalDocument(String base64Image, String mimeType) {
        String prompt = "Act as a real estate lawyer. Analyze this image of a legal document (contract/lease). " +
                        "Provide a simple summary of the key terms. " +
                        "Identify any 'Red Flags' or unusual clauses that the user should be aware of. " +
                        "Format the response in Markdown with sections for 'Summary', 'Key Terms', and '⚠️ Red Flags'.";

        GeminiRequest request = new GeminiRequest();
        Content content = new Content();
        content.addPart(new Part(prompt));
        
        InlineData inlineData = new InlineData();
        inlineData.setMimeType(mimeType);
        inlineData.setData(base64Image);
        
        Part imagePart = new Part();
        imagePart.setInlineData(inlineData);
        content.addPart(imagePart);
        
        request.addContent(content);

        return sendGeminiRequest(request);
    }

    public Map<String, Object> getLifestyleScore(String amenityList) {
        String prompt = "Based on this list of nearby amenities, rate the location for different lifestyles. " +
                        "Amenities: " + amenityList + ". " +
                        "Respond ONLY with a JSON object containing keys: 'familyFriendlyScore' (number out of 10) " +
                        "and 'youngProfessionalScore' (number out of 10).";
        
        String jsonResponse = getGeminiResponse(prompt);
        return parseJsonResponse(jsonResponse);
    }

    private String getGeminiResponse(String prompt) {
        GeminiRequest request = new GeminiRequest(prompt);
        return sendGeminiRequest(request);
    }

    private String sendGeminiRequest(GeminiRequest request) {
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
            return "Error communicating with AI service: " + e.getMessage();
        }
        return "No response generated.";
    }

    private Map<String, Object> parseJsonResponse(String jsonResponse) {
        try {
            // Clean the response to ensure it's valid JSON
            String cleanedJson = jsonResponse.replaceAll("`", "").replace("json", "").trim();
            if (cleanedJson.startsWith("{") && cleanedJson.endsWith("}")) {
                return objectMapper.readValue(cleanedJson, Map.class);
            }
            return Map.of(); // Return empty map if response is not a valid JSON object
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return Map.of("error", "Failed to parse AI response");
        }
    }
}
