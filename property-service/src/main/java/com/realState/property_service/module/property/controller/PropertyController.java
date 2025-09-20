package com.realState.property_service.module.property.controller;

import com.realState.property_service.common.exceptions.property.PropertyNotFoundException;
import com.realState.property_service.common.utils.ApiResponse;
import com.realState.property_service.module.property.dto.CreatePropertyDTO;
import com.realState.property_service.module.property.dto.PropertyDTO;
import com.realState.property_service.module.property.dto.UpdatePropertyDTO;
import com.realState.property_service.module.property.service.PropertyService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

/**
 * REST controller for managing property-related operations.
 */
@RestController
@RequestMapping(value = { "/api/properties", "/api/properties/" })
public class PropertyController {

    private final PropertyService propertyService;

    public PropertyController(PropertyService propertyService) {
        this.propertyService = propertyService;
    }

    // ================= Seller APIs =================

    /**
     * Create a new property draft.
     */
    @PostMapping
    public ResponseEntity<ApiResponse<PropertyDTO>> createProperty(
            @Valid @RequestBody CreatePropertyDTO dto) {
        PropertyDTO property = propertyService.createProperty(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(property));
    }

    /**
     * Get all properties for a specific owner.
     */
    @GetMapping("/owner/{owner_id}")
    public ResponseEntity<ApiResponse<List<PropertyDTO>>> getAllOwnerProperty(
            @PathVariable String owner_id) {
        UUID ownerId = UUID.fromString(owner_id);
        return ResponseEntity.ok(ApiResponse.success(propertyService.getAllOwnerProperty(ownerId)));
    }

    /**
     * Update an existing property draft.
     */
    @PutMapping("/{property_id}")
    public ResponseEntity<ApiResponse<PropertyDTO>> updatePropertyById(
            @PathVariable String property_id,
            @RequestBody UpdatePropertyDTO dto) {
        UUID propertyId = UUID.fromString(property_id);
        return ResponseEntity.ok(ApiResponse.success(propertyService.updatePropertyById(propertyId, dto)));
    }

    /**
     * Submit a property for approval.
     */
    @PatchMapping("/{property_id}/submit")
    public ResponseEntity<ApiResponse<Map<String, Object>>> submitApprovalRequest(
            @PathVariable String property_id) {
        UUID propertyId = UUID.fromString(property_id);
        propertyService.submitApprovalRequest(propertyId);

        Map<String, Object> response = new HashMap<>();
        response.put("approval", true);
        response.put("message", "Approval request submitted successfully");

        return ResponseEntity.ok(ApiResponse.success(response));
    }

    // ================= Admin APIs =================

    /**
     * Get all properties pending approval.
     */
    @GetMapping("/pending")
    public ResponseEntity<ApiResponse<List<PropertyDTO>>> getPropertyPendingApproval() {
        return ResponseEntity.ok(ApiResponse.success(propertyService.getPropertyPendingApproval()));
    }

    /**
     * Approve a property.
     */
    @PatchMapping("/{property_id}/approve")
    public ResponseEntity<ApiResponse<Map<String, Object>>> approveProperty(
            @PathVariable String property_id) {
        UUID propertyId = UUID.fromString(property_id);
        propertyService.approveProperty(propertyId);

        Map<String, Object> response = new HashMap<>();
        response.put("approval", true);
        response.put("message", "Property approved successfully");

        return ResponseEntity.ok(ApiResponse.success(response));
    }

    /**
     * Reject a property.
     */
    @PatchMapping("/{property_id}/reject")
    public ResponseEntity<ApiResponse<Map<String, Object>>> rejectProperty(
            @PathVariable String property_id) {
        UUID propertyId = UUID.fromString(property_id);
        propertyService.rejectProperty(propertyId);

        Map<String, Object> response = new HashMap<>();
        response.put("approval", false);
        response.put("message", "Property rejected successfully");

        return ResponseEntity.ok(ApiResponse.success(response));
    }

    /**
     * Archive a property.
     */
    @PatchMapping("/{property_id}/archive")
    public ResponseEntity<ApiResponse<Map<String, Object>>> archivedProperty(
            @PathVariable String property_id) {
        UUID propertyId = UUID.fromString(property_id);
        propertyService.archiveProperty(propertyId);

        Map<String, Object> response = new HashMap<>();
        response.put("archived", true);
        response.put("message", "Property archived successfully");

        return ResponseEntity.ok(ApiResponse.success(response));
    }

    /**
     * Delete a property by ID.
     * <p>
     * ⚠️ TODO: Replace delete with archive in future for soft-deletion.
     * </p>
     */
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<ApiResponse<Boolean>> deletePropertyById(@PathVariable String id) {
        UUID propertyId = UUID.fromString(id);
        propertyService.deletePropertyById(propertyId);
        return ResponseEntity.ok(ApiResponse.success(true));
    }

    /**
     * Get all properties.
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<PropertyDTO>>> getAllProperty() {
        return ResponseEntity.ok(ApiResponse.success(propertyService.getAllProperty()));
    }

    // ================= Buyer APIs =================

    /**
     * Get all approved properties.
     */
    @GetMapping("/approved")
    public ResponseEntity<ApiResponse<List<PropertyDTO>>> getApprovedProperty() {
        return ResponseEntity.ok(ApiResponse.success(propertyService.getApprovedProperty()));
    }

    /**
     * Get property details by ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PropertyDTO>> getPropertyById(@PathVariable String id) {
        UUID propertyId = UUID.fromString(id);
        PropertyDTO property = propertyService.getPropertyById(propertyId);
        return ResponseEntity.ok(ApiResponse.success(property));
    }

    // ================= Utility =================

    /**
     * Test endpoint for throwing exception (for debugging).
     */
    @GetMapping("/test/test-exception")
    public void testException() {
        throw new PropertyNotFoundException("Forced test");
    }
}
