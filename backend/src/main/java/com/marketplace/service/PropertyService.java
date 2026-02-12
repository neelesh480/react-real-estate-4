package com.marketplace.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import com.marketplace.model.Property;
import com.marketplace.repository.PropertyRepository;
import java.util.List;

@Service
public class PropertyService {

    @Autowired
    private PropertyRepository propertyRepository;

    public Page<Property> getAllProperties(Pageable pageable) {
        return propertyRepository.findAll(pageable);
    }

    public Property getPropertyById(Long id) {
        return propertyRepository.findById(id).orElse(null);
    }

    public Property saveProperty(Property property) {
        return propertyRepository.save(property);
    }

    public void deleteProperty(Long id) {
        propertyRepository.deleteById(id);
    }

    public Page<Property> searchProperties(String location, Double minPrice, Double maxPrice, Pageable pageable) {
        return propertyRepository.searchProperties(location, minPrice, maxPrice, pageable);
    }

    public List<Property> getPropertiesByUser(String email) {
        return propertyRepository.findByUserEmail(email);
    }
}
