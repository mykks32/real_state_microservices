package com.realState.property_service.module.property.controller;

import com.realState.property_service.common.utils.ApiResponse;
import com.realState.property_service.database.enums.StateEnum;
import com.realState.property_service.database.enums.StatusEnum;
import com.realState.property_service.database.enums.TypeEnum;
import com.realState.property_service.module.property.dto.CreatePropertyDTO;
import com.realState.property_service.module.property.dto.PropertyDTO;
import com.realState.property_service.module.property.dto.PropertyFilterDTO;
import com.realState.property_service.module.property.dto.UpdatePropertyDTO;
import com.realState.property_service.module.property.service.PropertyService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import org.apache.coyote.BadRequestException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

import static ch.qos.logback.core.util.StringUtil.capitalizeFirstLetter;

/**
 * REST controller for managing property-related operations.
 */
@RestController
@RequestMapping(value = { "/properties" })
public class PropertyController {

    private final PropertyService propertyService;
    private static final Logger logger = LoggerFactory.getLogger(PropertyController.class);

    public PropertyController(PropertyService propertyService) {
        this.propertyService = propertyService;
    }


    // ================= Buyer APIs =================
    /** 1. Get Filtered Properties */
    @GetMapping("/filter")
    public ResponseEntity<ApiResponse<List<PropertyDTO>>> filterPropertiesWithParams(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String state,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {
        PropertyFilterDTO filterDTO = new PropertyFilterDTO();

        try {
            // Convert PascalCase: capitalize first letter, lowercase rest
            filterDTO.setStatus(status != null ? StatusEnum.valueOf(capitalizeFirstLetter(status)) : null);
            filterDTO.setType(type != null ? TypeEnum.valueOf(capitalizeFirstLetter(type)) : null);
            filterDTO.setState(state != null ? StateEnum.valueOf(capitalizeFirstLetter(state)) : null);
        } catch (IllegalArgumentException ex) {
            logger.error("Invalid enum value - status: {}, type: {}, state: {}", status, type, state, ex);
            throw new IllegalArgumentException("Invalid filter value: " + ex.getMessage());
        }
        // Validate page number
        if (page < 1) {
            page = 1;
        }

        // Validate and cap size to prevent abuse
        if (size < 1) {
            size = 10;
        }
        if (size > 100) {
            size = 100;
        }

        // Convert 1-indexed to 0-indexed for Spring Data
        int pageNumber = page - 1;

        filterDTO.setPage(pageNumber);
        filterDTO.setSize(size);

        return ResponseEntity.ok(propertyService.filterProperties(filterDTO));
    }


    /**
     * 2. Get all approved properties.
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
    public ResponseEntity<ApiResponse<List<PropertyDTO>>> getApprovedProperty(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        // Validate page number
        if (page < 1) {
            page = 1;
        }

        // Validate and cap size to prevent abuse
        if (size < 1) {
            size = 10;
        }
        if (size > 100) {
            size = 100;
        }

        // Convert 1-indexed to 0-indexed for Spring Data
        int pageNumber = page - 1;

        return ResponseEntity.ok(propertyService.getApprovedProperty(pageNumber, size));
    }

    /**
     * 3. Get property details by IxD.
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
     * 1. Create a new property draft.
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
     * 2. Get all properties for a specific owner.
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
    @PostMapping("/owner/")
    public ResponseEntity<ApiResponse<List<PropertyDTO>>> getAllOwnerProperty(
            @Valid @RequestBody Map<String, String> body,            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        String ownerIdStr = body.get("ownerId");

        UUID ownerId = UUID.fromString(ownerIdStr);

        // Validate page number
        if (page < 1) {
            page = 1;
        }

        // Validate and cap size to prevent abuse
        if (size < 1) {
            size = 10;
        }
        if (size > 100) {
            size = 100;
        }

        // Convert 1-indexed to 0-indexed for Spring Data
        int pageNumber = page - 1;

        return ResponseEntity.ok(propertyService.getAllOwnerProperty(ownerId, pageNumber, size));
    }

    /**
     * 3. Update an existing property draft.
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
     * 4. Submit a property for approval.
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
     * 1. Get all properties pending approval.
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
    public ResponseEntity<ApiResponse<List<PropertyDTO>>> getPropertyPendingApproval(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        // Validate page number
        if (page < 1) {
            page = 1;
        }

        // Validate and cap size to prevent abuse
        if (size < 1) {
            size = 10;
        }
        if (size > 100) {
            size = 100;
        }

        // Convert 1-indexed to 0-indexed for Spring Data
        int pageNumber = page - 1;
        return ResponseEntity.ok(propertyService.getPropertyPendingApproval(pageNumber, size));
    }

    /**
     * 2. Approve a property.
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
     * 3. Reject a property.
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
     * 4. Archive a property.
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
     * 5. Delete a property by ID.
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
     * 6. Get all properties.
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
    public ResponseEntity<ApiResponse<List<PropertyDTO>>> getAllProperty(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        // Validate page number
        if (page < 1) {
            page = 1;
        }

        // Validate and cap size to prevent abuse
        if (size < 1) {
            size = 10;
        }
        if (size > 100) {
            size = 100;
        }

        // Convert 1-indexed to 0-indexed for Spring Data
        int pageNumber = page - 1;

        return ResponseEntity.ok(propertyService.getAllProperty(pageNumber, size));
    }

    /**
     * 1. Create a new property approved.
     */
    @Operation(
            summary = "Create a new property",
            description = "Create a new property (Admin)",
            tags = { "Admin APIs" }
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
    @PostMapping("/admin/create")
    public ResponseEntity<ApiResponse<PropertyDTO>> createAdminApprovedProperty(
            @Valid @RequestBody CreatePropertyDTO dto) {
        PropertyDTO property = propertyService.createAdminApprovedProperty(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(property));
    }
}