package com.realState.property_service.database.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.realState.property_service.database.entity.Property;;;;;

@Repository
public interface PropertyRepository extends JpaRepository<Property, UUID> {
    // @Query("SELECT p FROM Property p WHERE p.owner_id = :owner_id")
    // List<Property> findAllByOwnerId(@Param("owner_id") UUID owner_id);

    List<Property> findByOwnerId(UUID ownerId);

    
}
