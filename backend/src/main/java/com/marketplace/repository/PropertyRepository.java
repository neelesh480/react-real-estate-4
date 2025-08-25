package com.marketplace.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.marketplace.model.Property;
import com.marketplace.model.User;

import java.util.List;

public interface PropertyRepository extends JpaRepository<Property, Long> {
    
    List<Property> findByUser(User user);
    
    @Query("SELECT p FROM Property p WHERE " +
           "(:location IS NULL OR LOWER(p.location) LIKE LOWER(CONCAT('%', :location, '%'))) AND " +
           "(:minPrice IS NULL OR p.price >= :minPrice) AND " +
           "(:maxPrice IS NULL OR p.price <= :maxPrice) AND " +
           "(:propertyType IS NULL OR p.propertyType = :propertyType)")
    List<Property> searchProperties(
        @Param("location") String location,
        @Param("minPrice") Double minPrice,
        @Param("maxPrice") Double maxPrice,
        @Param("propertyType") String propertyType
    );
}