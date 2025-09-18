package com.realState.property_service.module.property.service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.realState.property_service.module.property.dto.CreatePropertyDTO;
import com.realState.property_service.module.property.dto.PropertyDTO;

@Service
public interface PropertyService {

    // Create Property
    PropertyDTO createProperty(CreatePropertyDTO dto);

    // Get Property By Id
    PropertyDTO getPropertyById(UUID id);

    List<PropertyDTO> getAllProperty();

    void deletePropertyById(UUID id);

    PropertyDTO updatePropertyById(UUID id, Optional<CreatePropertyDTO> dtoOptional);
} 
