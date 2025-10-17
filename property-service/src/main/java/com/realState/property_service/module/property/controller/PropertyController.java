package com.realState.property_service.module.property.controller;

import com.realState.property_service.common.exceptions.property.PropertyNotFoundException;
import com.realState.property_service.common.utils.ApiResponse;
import com.realState.property_service.module.property.dto.CreatePropertyDTO;
import com.realState.property_service.module.property.dto.PropertyDTO;
import com.realState.property_service.module.property.dto.UpdatePropertyDTO;
import com.realState.property_service.module.property.service.PropertyService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

/**
 * REST controller for managing property-related operations.
 */
@RestController
@RequestMapping(value = { "/properties" })
public class PropertyController {

    private final PropertyService propertyService;

    public PropertyController(PropertyService propertyService) {
        this.propertyService = propertyService;
    }


    // ================= Buyer APIs =================

    /**
     * Get all approved properties.
     */
    @Operation(
            summary = "Get all approved properties",
            description = "Get all approved properties (Buyer)",
            tags = { "Buyer APIs" }
    )
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "Approved properties retrieved successfully"
            )
    })
    @GetMapping("/approved")
    public ResponseEntity<ApiResponse<List<PropertyDTO>>> getApprovedProperty() {
        return ResponseEntity.ok(ApiResponse.success(propertyService.getApprovedProperty()));
    }

    /**
     * Get property details by ID.
     */
    @Operation(
            summary = "Get property details by ID",
            description = "Get property details by ID (Buyer)",
            tags = { "Buyer APIs" }
    )
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "Property details retrieved successfully"
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "404",
                    description = "Property not found"
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "400",
                    description = "Invalid property ID format"
            )
    })
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PropertyDTO>> getPropertyById(
            @Parameter(description = "Property ID (UUID format)", required = true)
            @PathVariable String id) {
        UUID propertyId = UUID.fromString(id);
        PropertyDTO property = propertyService.getPropertyById(propertyId);
        return ResponseEntity.ok(ApiResponse.success(property));
    }

    // ================= Seller APIs =================

    /**
     * Create a new property draft.
     */
    @Operation(
            summary = "Create a new property draft",
            description = "Create a new property draft (Seller)",
            tags = { "Seller APIs" }
    )
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "201",
                    description = "Property created successfully",
                    content = @Content(schema = @Schema(implementation = PropertyDTO.class))
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "400",
                    description = "Invalid input data"
            )
    })
    @PostMapping
    public ResponseEntity<ApiResponse<PropertyDTO>> createProperty(
            @Valid @RequestBody CreatePropertyDTO dto) {
        PropertyDTO property = propertyService.createProperty(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(property));
    }

    /**
     * Get all properties for a specific owner.
     */
    @Operation(
            summary = "Get all properties for a specific owner",
            description = "Get all properties for a specific owner (Seller)",
            tags = { "Seller APIs" }
    )
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "Properties retrieved successfully"
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "400",
                    description = "Invalid owner ID format"
            )
    })
    @GetMapping("/owner/{owner_id}")
    public ResponseEntity<ApiResponse<List<PropertyDTO>>> getAllOwnerProperty(
            @Parameter(description = "Owner ID (UUID format)", required = true)
            @PathVariable String owner_id) {
        UUID ownerId = UUID.fromString(owner_id);
        return ResponseEntity.ok(ApiResponse.success(propertyService.getAllOwnerProperty(ownerId)));
    }

    /**
     * Update an existing property draft.
     */
    @Operation(
            summary = "Update an existing property draft",
            description = "Update an existing property draft (Seller)",
            tags = { "Seller APIs" }
    )
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "Property updated successfully"
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "404",
                    description = "Property not found"
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "400",
                    description = "Invalid property ID format or input data"
            )
    })
    @PutMapping("/{property_id}")
    public ResponseEntity<ApiResponse<PropertyDTO>> updatePropertyById(
            @Parameter(description = "Property ID (UUID format)", required = true)
            @PathVariable String property_id,
            @RequestBody UpdatePropertyDTO dto) {
        UUID propertyId = UUID.fromString(property_id);
        return ResponseEntity.ok(ApiResponse.success(propertyService.updatePropertyById(propertyId, dto)));
    }

    /**
     * Submit a property for approval.
     */
    @Operation(
            summary = "Submit a property for approval",
            description = "Submit a property for approval (Seller)",
            tags = { "Seller APIs" }
    )
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "Approval request submitted successfully"
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "404",
                    description = "Property not found"
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "400",
                    description = "Invalid property ID format"
            )
    })
    @PatchMapping("/{property_id}/submit")
    public ResponseEntity<ApiResponse<Map<String, Object>>> submitApprovalRequest(
            @Parameter(description = "Property ID (UUID format)", required = true)
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
    @Operation(
            summary = "Get all properties pending approval",
            description = "Get all properties pending approval (Admin)",
            tags = { "Admin APIs" }
    )
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "Pending properties retrieved successfully"
            )
    })
    @GetMapping("/pending")
    public ResponseEntity<ApiResponse<List<PropertyDTO>>> getPropertyPendingApproval() {
        return ResponseEntity.ok(ApiResponse.success(propertyService.getPropertyPendingApproval()));
    }

    /**
     * Approve a property.
     */
    @Operation(
            summary = "Approve a property",
            description = "Approve a property (Admin)",
            tags = { "Admin APIs" }
    )
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "Property approved successfully"
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "404",
                    description = "Property not found"
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "400",
                    description = "Invalid property ID format"
            )
    })
    @PatchMapping("/{property_id}/approve")
    public ResponseEntity<ApiResponse<Map<String, Object>>> approveProperty(
            @Parameter(description = "Property ID (UUID format)", required = true)
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
    @Operation(
            summary = "Reject a property",
            description = "Reject a property (Admin)",
            tags = { "Admin APIs" }
    )
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "Property rejected successfully"
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "404",
                    description = "Property not found"
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "400",
                    description = "Invalid property ID format"
            )
    })
    @PatchMapping("/{property_id}/reject")
    public ResponseEntity<ApiResponse<Map<String, Object>>> rejectProperty(
            @Parameter(description = "Property ID (UUID format)", required = true)
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
    @Operation(
            summary = "Archive a property",
            description = "Archive a property (Admin)",
            tags = { "Admin APIs" }
    )
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "Property archived successfully"
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "404",
                    description = "Property not found"
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "400",
                    description = "Invalid property ID format"
            )
    })
    @PatchMapping("/{property_id}/archive")
    public ResponseEntity<ApiResponse<Map<String, Object>>> archivedProperty(
            @Parameter(description = "Property ID (UUID format)", required = true)
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
    @Operation(
            summary = "Delete a property by ID",
            description = "Delete a property by ID (Admin) - ⚠️ TODO: Replace delete with archive in future for soft-deletion",
            tags = { "Admin APIs" }
    )
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "Property deleted successfully"
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "404",
                    description = "Property not found"
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "400",
                    description = "Invalid property ID format"
            )
    })
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<ApiResponse<Boolean>> deletePropertyById(
            @Parameter(description = "Property ID (UUID format)", required = true)
            @PathVariable String id) {
        UUID propertyId = UUID.fromString(id);
        propertyService.deletePropertyById(propertyId);
        return ResponseEntity.ok(ApiResponse.success(true));
    }

    /**
     * Get all properties.
     */
    @Operation(
            summary = "Get all properties",
            description = "Get all properties (Admin)",
            tags = { "Admin APIs" }
    )
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "Properties retrieved successfully"
            )
    })
    @GetMapping
    public ResponseEntity<ApiResponse<List<PropertyDTO>>> getAllProperty() {
        return ResponseEntity.ok(ApiResponse.success(propertyService.getAllProperty()));
    }
}