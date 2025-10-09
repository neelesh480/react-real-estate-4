package com.marketplace.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.marketplace.model.Property;
import com.marketplace.service.PropertyService;
import java.util.List;

@RestController
@RequestMapping("/api/properties")
@CrossOrigin(origins = "http://localhost:3000")
public class PropertyController {

    @Autowired
    private PropertyService propertyService;

    @GetMapping
    public ResponseEntity<List<Property>> getAllProperties() {
        List<Property> properties = propertyService.getAllProperties();
        return ResponseEntity.ok(properties);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Property> getPropertyById(@PathVariable Long id) {
        Property property = propertyService.getPropertyById(id);
        if (property != null) {
            return ResponseEntity.ok(property);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<Property> createProperty(@RequestBody Property property) {
        Property savedProperty = propertyService.saveProperty(property);
        return ResponseEntity.ok(savedProperty);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Property> updateProperty(@PathVariable Long id, @RequestBody Property property) {
        Property existingProperty = propertyService.getPropertyById(id);
        if (existingProperty == null) {
            return ResponseEntity.notFound().build();
        }

        property.setId(id);
        Property updatedProperty = propertyService.saveProperty(property);
        return ResponseEntity.ok(updatedProperty);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProperty(@PathVariable Long id) {
        Property property = propertyService.getPropertyById(id);
        if (property == null) {
            return ResponseEntity.notFound().build();
        }

        propertyService.deleteProperty(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/search")
    public ResponseEntity<List<Property>> searchProperties(
            @RequestParam(required = false) String location,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice) {
        List<Property> properties = propertyService.searchProperties(location, minPrice, maxPrice);
        return ResponseEntity.ok(properties);
    }
}