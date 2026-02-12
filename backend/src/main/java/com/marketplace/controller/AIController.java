package com.marketplace.controller;

import com.marketplace.model.Property;
import com.marketplace.service.AIService;
import com.marketplace.service.PropertyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Base64;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "http://localhost:3000")
public class AIController {

    @Autowired
    private AIService aiService;

    @Autowired
    private PropertyService propertyService;

    @PostMapping("/generate-description")
    public ResponseEntity<Map<String, String>> generateDescription(@RequestBody Map<String, String> payload) {
        String details = payload.get("details");
        String description = aiService.generatePropertyDescription(details);
        return ResponseEntity.ok(Map.of("description", description));
    }

    @PostMapping("/chat")
    public ResponseEntity<Map<String, String>> chat(@RequestBody Map<String, String> payload) {
        String question = payload.get("question");
        String answer = aiService.generateChatResponse(question);
        return ResponseEntity.ok(Map.of("answer", answer));
    }

    @PostMapping("/search")
    public ResponseEntity<List<Property>> search(@RequestBody Map<String, String> payload) {
        String query = payload.get("query");
        Map<String, Object> criteria = aiService.extractSearchCriteria(query);

        String location = (String) criteria.get("location");
        Double minPrice = criteria.containsKey("minPrice") ? ((Number) criteria.get("minPrice")).doubleValue() : null;
        Double maxPrice = criteria.containsKey("maxPrice") ? ((Number) criteria.get("maxPrice")).doubleValue() : null;

        // Use a default page size of 20 for AI search results
        Page<Property> propertyPage = propertyService.searchProperties(location, minPrice, maxPrice, PageRequest.of(0, 20));
        return ResponseEntity.ok(propertyPage.getContent());
    }

    @PostMapping("/neighborhood-insights")
    public ResponseEntity<Map<String, String>> getNeighborhoodInsights(@RequestBody Map<String, String> payload) {
        String location = payload.get("location");
        String report = aiService.generateNeighborhoodReport(location);
        return ResponseEntity.ok(Map.of("report", report));
    }

    @PostMapping("/search-by-image")
    public ResponseEntity<Map<String, Object>> searchByImage(@RequestParam("image") MultipartFile image) {
        try {
            String base64Image = Base64.getEncoder().encodeToString(image.getBytes());
            String mimeType = image.getContentType();
            
            Map<String, Object> criteria = aiService.extractCriteriaFromImage(base64Image, mimeType);
            
            return ResponseEntity.ok(criteria);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to process image"));
        }
    }

    @PostMapping("/interior-design")
    public ResponseEntity<Map<String, String>> generateInteriorDesign(
            @RequestParam("image") MultipartFile image,
            @RequestParam("style") String style) {
        try {
            String base64Image = Base64.getEncoder().encodeToString(image.getBytes());
            String mimeType = image.getContentType();
            
            String advice = aiService.generateInteriorDesignAdvice(base64Image, mimeType, style);
            
            return ResponseEntity.ok(Map.of("advice", advice));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to generate design advice"));
        }
    }

    @PostMapping("/investment-analysis")
    public ResponseEntity<Map<String, Object>> generateInvestmentAnalysis(@RequestBody Map<String, String> payload) {
        String details = payload.get("details");
        Map<String, Object> analysis = aiService.generateInvestmentAnalysis(details);
        return ResponseEntity.ok(analysis);
    }

    @PostMapping("/generate-offer-letter")
    public ResponseEntity<Map<String, String>> generateOfferLetter(@RequestBody Map<String, String> payload) {
        String details = payload.get("details");
        String offerAmount = payload.get("offerAmount");
        String conditions = payload.get("conditions");
        
        String letter = aiService.generateOfferLetter(details, offerAmount, conditions);
        return ResponseEntity.ok(Map.of("letter", letter));
    }

    @PostMapping("/summarize-document")
    public ResponseEntity<Map<String, String>> summarizeDocument(@RequestParam("image") MultipartFile image) {
        try {
            String base64Image = Base64.getEncoder().encodeToString(image.getBytes());
            String mimeType = image.getContentType();
            
            String summary = aiService.summarizeLegalDocument(base64Image, mimeType);
            
            return ResponseEntity.ok(Map.of("summary", summary));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to summarize document"));
        }
    }

    @PostMapping("/lifestyle-score")
    public ResponseEntity<Map<String, Object>> getLifestyleScore(@RequestBody Map<String, String> payload) {
        String amenityList = payload.get("amenityList");
        Map<String, Object> score = aiService.getLifestyleScore(amenityList);
        return ResponseEntity.ok(score);
    }
}
