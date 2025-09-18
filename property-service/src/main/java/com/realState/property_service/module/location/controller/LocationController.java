package com.realState.property_service.module.location.controller;

import org.springframework.web.bind.annotation.RestController;

import com.realState.property_service.module.location.dto.CreateLocationDTO;
import com.realState.property_service.module.location.dto.LocationDTO;
import com.realState.property_service.module.location.service.LocationService;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;


@RestController
@RequestMapping("/api/location")
public class LocationController {

    @Autowired
    private LocationService locationService;
    
    // @PostMapping("/create")
    // public ResponseEntity<LocationDTO> createLocation(@Valid @RequestBody CreateLocationDTO dto) {
    //     return ResponseEntity.status(HttpStatus.CREATED).body(locationService.createLocation(dto));
    // }
    
}
