package com.realState.property_service.module.property.service;

import org.springframework.stereotype.Service;

import com.realState.property_service.module.property.dto.CreatePropetyDTO;
import com.realState.property_service.module.property.dto.PropertyDTO;

@Service
public interface PropertyService {

    // Create Property
    PropertyDTO createProperty(CreatePropetyDTO dto);
    
} 
