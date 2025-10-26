package com.realState.property_service.module.property.service;

import java.util.List;
import java.util.UUID;

import com.realState.property_service.common.utils.ApiResponse;
import com.realState.property_service.module.property.dto.PropertyFilterDTO;
import org.springframework.stereotype.Service;

import com.realState.property_service.module.property.dto.CreatePropertyDTO;
import com.realState.property_service.module.property.dto.PropertyDTO;
import com.realState.property_service.module.property.dto.UpdatePropertyDTO;

/**
 * Service interface for managing property operations.
 * Handles seller, admin, and buyer related property workflows.
 */
@Service
public interface PropertyService {

    // ================== SELLER ==================

    /**
     * 1. Create a new property for a seller.
     * 
     * @param dto the property creation data
     * @return the created property as PropertyDTO
     */
    PropertyDTO createProperty(CreatePropertyDTO dto);

    /**
     * 2. Get all properties of a specific owner.
     * 
     * @param ownerId the UUID of the owner
     * @return list of PropertyDTOs belonging to the owner
     */

    ApiResponse<List<PropertyDTO>> getAllOwnerProperty(UUID ownerId, int page, int size);

    /**
     * 3. Update an existing property.
     * 
     * @param id  the UUID of the property to update
     * @param dto the property update data
     * @return the updated PropertyDTO
     */
    PropertyDTO updatePropertyById(UUID id, UpdatePropertyDTO dto);

    /**
     * 4. Submit a property for admin approval.
     * 
     * @param id the UUID of the property
     */
    void submitApprovalRequest(UUID id);

    // ================== ADMIN ==================

    /**
     * 1. Get all properties pending admin approval.
     * 
     * @return list of PropertyDTOs pending approval
     */
    ApiResponse<List<PropertyDTO>> getPropertyPendingApproval(int page, int size);

    /**
     * 2. Approve a property.
     * 
     * @param id the UUID of the property to approve
     */
    void approveProperty(UUID id);

    /**
     * 3. Reject a property.
     * 
     * @param id the UUID of the property to reject
     */
    void rejectProperty(UUID id);

    /**
     * 4. Archive a property.
     * 
     * @param id the UUID of the property to archive
     */
    void archiveProperty(UUID id);

    /**
     * 5. Delete a property.
     * 
     * @param id the UUID of the property to delete
     */
    void deletePropertyById(UUID id);

    /**
     * 6. Get all properties.
     * 
     * @return list of all PropertyDTOs
     */
    ApiResponse<List<PropertyDTO>> getAllProperty(int page, int size);

    /**
     * 7. Create a new property for a seller.
     *
     * @param dto the property creation data
     * @return the created property as PropertyDTO
     */
    PropertyDTO createAdminApprovedProperty(CreatePropertyDTO dto);

    // ================== BUYER ==================
    /**
     * 1. Get all filtered properties.
     *
     * @return list of approved PropertyDTOs
     */
    ApiResponse<List<PropertyDTO>> filterProperties(PropertyFilterDTO filterDTO);


    /**
     * 2. Get all approved properties.
     * 
     * @return list of approved PropertyDTOs
     */
    ApiResponse<List<PropertyDTO>> getApprovedProperty(int page, int size);

    /**
     * 3. Get a property by its ID.
     * 
     * @param id the UUID of the property
     * @return the PropertyDTO for the given ID
     */
    PropertyDTO getPropertyById(UUID id);
}