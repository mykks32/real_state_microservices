package com.realState.property_service.module.property.controller;

import org.springframework.web.bind.annotation.RestController;

import com.realState.property_service.module.property.dto.CreatePropertyDTO;
import com.realState.property_service.module.property.dto.PropertyDTO;
import com.realState.property_service.module.property.dto.UpdatePropertyDTO;
import com.realState.property_service.module.property.service.PropertyService;

import jakarta.validation.Valid;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;


@RestController
@RequestMapping("/api/properties")
public class PropertyController {

    @Autowired
    private PropertyService propertyService;

    // Seller Apis
    // 1. Create Property draft
    @PostMapping()
    public ResponseEntity<PropertyDTO> createProperty(@Valid @RequestBody() CreatePropertyDTO dto) {
        PropertyDTO property = propertyService.createProperty(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(property);
    }

    // 2. list of seller property : all status from draft to approved to reject
    @GetMapping("/owner/{owner_id}")
    public ResponseEntity<List<PropertyDTO>> getAllOwnerProperty(@PathVariable String owner_id) {
        UUID ownerId = UUID.fromString(owner_id);
        return ResponseEntity.status(HttpStatus.OK).body(propertyService.getAllOwnerProperty(ownerId));
    }

    // 3. Update Property Draft
    @PutMapping("/{property_id}")
    public ResponseEntity<PropertyDTO> updatePropertyById(@PathVariable String property_id,
            @RequestBody UpdatePropertyDTO dto) {
        UUID propertyId = UUID.fromString(property_id);
        return ResponseEntity.status(HttpStatus.OK).body(propertyService.updatePropertyById(propertyId, dto));
    }

    // 4. Submit Approval Request
    @PatchMapping("/{property_id}/submit")
    public ResponseEntity<Map<String, Object>> submitApprovalRequest(@PathVariable String property_id) {
        UUID propertyId = UUID.fromString(property_id);
        propertyService.submitApprovalRequest(propertyId);

        Map<String, Object> response = new HashMap<>();
        response.put("approval", true);
        response.put("message", "Approval request submitted successfully");

        return ResponseEntity.ok(response);
    }

    // Buyer Api
    // TODO: Implement fetch only approved properties

    // Fetch data of Property by Id
    @GetMapping("/{id}")
    public ResponseEntity<PropertyDTO> getPropertyById(@PathVariable String id) {
        UUID propertyId = UUID.fromString(id);
        PropertyDTO property = propertyService.getPropertyById(propertyId);
        return ResponseEntity.status(HttpStatus.OK).body(property);
    }

    // Admin API
    // TODO: Implement admin endpoints for property management:
    // 1. List all pending-approval properties
    @GetMapping("/pending")
    public ResponseEntity<List<PropertyDTO>> getPropertyPendingApproval() {
        return ResponseEntity.status(HttpStatus.OK).body(propertyService.getPropertyPendingApproval());
    }
    

    // 2. Approve property
    @PatchMapping("/{property_id}/approve")
    public ResponseEntity<Map<String, Object>> approveProperty(@PathVariable String property_id) {
        UUID propertyId = UUID.fromString(property_id);
        propertyService.approveProperty(propertyId);

        Map<String, Object> response = new HashMap<>();
        response.put("approval", true);
        response.put("message", "Property Approved successfully");

        return ResponseEntity.ok(response);
    }

    // 3. Reject property
    @PatchMapping("/{property_id}/reject")
    public ResponseEntity<Map<String, Object>> rejectProperty(@PathVariable String property_id) {
        UUID propertyId = UUID.fromString(property_id);
        propertyService.rejectProperty(propertyId);

        Map<String, Object> response = new HashMap<>();
        response.put("approval", true);
        response.put("message", "Property reject successfully");

        return ResponseEntity.ok(response);
    }

    // 4. Archived property
    @PatchMapping("/{property_id}/archive")
    public ResponseEntity<Map<String, Object>> archivedProperty(@PathVariable String property_id) {
        UUID propertyId = UUID.fromString(property_id);
        propertyService.archiveProperty(propertyId);

        Map<String, Object> response = new HashMap<>();
        response.put("approval", true);
        response.put("message", "Property archived successfully");

        return ResponseEntity.ok(response);
    }


    // - Reject property (with optional reason)
    // - Archive property
    // TODO: change this delete request to archive request
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Boolean> deletePropertyById(@PathVariable String id) {
        UUID propertyId = UUID.fromString(id);
        propertyService.deletePropertyById(propertyId);
        return ResponseEntity.status(HttpStatus.OK).body(true);
    }
    // - List all properties for admin dashboard

}
