package com.realState.property_service.module.property.controller;

import org.springframework.web.bind.annotation.RestController;

import com.realState.property_service.module.property.dto.CreatePropetyDTO;
import com.realState.property_service.module.property.dto.PropertyDTO;
import com.realState.property_service.module.property.service.PropertyService;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/api/property")
public class PropertyController {

    @Autowired
    private PropertyService propertyService;

    @PostMapping("/create")
    public ResponseEntity<PropertyDTO> createProperty(@Valid @RequestBody() CreatePropetyDTO dto) {
        PropertyDTO property = propertyService.createProperty(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(property);
    }

}
