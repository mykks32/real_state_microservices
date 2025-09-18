package com.realState.property_service.module.property.controller;

import org.springframework.web.bind.annotation.RestController;

import com.realState.property_service.module.property.dto.CreatePropertyDTO;
import com.realState.property_service.module.property.dto.PropertyDTO;
import com.realState.property_service.module.property.service.PropertyService;

import jakarta.validation.Valid;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;


@RestController
@RequestMapping("/api/property")
public class PropertyController {

    @Autowired
    private PropertyService propertyService;

    @PostMapping("/create")
    public ResponseEntity<PropertyDTO> createProperty(@Valid @RequestBody() CreatePropertyDTO dto) {
        PropertyDTO property = propertyService.createProperty(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(property);
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<PropertyDTO> getPropertyById(@PathVariable String id) {
        UUID propertyId = UUID.fromString(id);
        PropertyDTO property = propertyService.getPropertyById(propertyId);
        return ResponseEntity.status(HttpStatus.OK).body(property);
    }

    @GetMapping("/get/all")
    public ResponseEntity<List<PropertyDTO>> getAllProperty() {
        return ResponseEntity.status(HttpStatus.OK).body(propertyService.getAllProperty());
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<PropertyDTO> updatePropertyById(@PathVariable String id, @RequestBody Optional<CreatePropertyDTO> dto) {
        UUID propertyId = UUID.fromString(id);
        return ResponseEntity.status(HttpStatus.OK).body(propertyService.updatePropertyById(propertyId, dto));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Boolean> deletePropertyById(@PathVariable String id) {
        UUID propertyId = UUID.fromString(id);
        propertyService.deletePropertyById(propertyId);
        return ResponseEntity.status(HttpStatus.OK).body(true);
    } 

}
