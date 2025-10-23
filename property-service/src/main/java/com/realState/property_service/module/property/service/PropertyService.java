package com.realState.property_service.module.property.service;

import java.util.List;
import java.util.UUID;

import com.realState.property_service.common.utils.ApiResponse;
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
     * Create a new property for a seller.
     * 
     * @param dto the property creation data
     * @return the created property as PropertyDTO
     */
    PropertyDTO createProperty(CreatePropertyDTO dto);

    /**
     * Get all properties of a specific owner.
     * 
     * @param ownerId the UUID of the owner
     * @return list of PropertyDTOs belonging to the owner
     */
    List<PropertyDTO> getAllOwnerProperty(UUID ownerId);

    /**
     * Update an existing property.
     * 
     * @param id  the UUID of the property to update
     * @param dto the property update data
     * @return the updated PropertyDTO
     */
    PropertyDTO updatePropertyById(UUID id, UpdatePropertyDTO dto);

    /**
     * Submit a property for admin approval.
     * 
     * @param id the UUID of the property
     */
    void submitApprovalRequest(UUID id);

    // ================== ADMIN ==================

    /**
     * Get all properties pending admin approval.
     * 
     * @return list of PropertyDTOs pending approval
     */
    ApiResponse<List<PropertyDTO>> getPropertyPendingApproval(int page, int size);

    /**
     * Approve a property.
     * 
     * @param id the UUID of the property to approve
     */
    void approveProperty(UUID id);

    /**
     * Reject a property.
     * 
     * @param id the UUID of the property to reject
     */
    void rejectProperty(UUID id);

    /**
     * Archive a property.
     * 
     * @param id the UUID of the property to archive
     */
    void archiveProperty(UUID id);

    /**
     * Delete a property.
     * 
     * @param id the UUID of the property to delete
     */
    void deletePropertyById(UUID id);

    /**
     * Get all properties.
     * 
     * @return list of all PropertyDTOs
     */
    ApiResponse<List<PropertyDTO>> getAllProperty(int page, int size);

    // ================== BUYER ==================

    /**
     * Get all approved properties.
     * 
     * @return list of approved PropertyDTOs
     */
    ApiResponse<List<PropertyDTO>> getApprovedProperty(int page, int size);

    /**
     * Get a property by its ID.
     * 
     * @param id the UUID of the property
     * @return the PropertyDTO for the given ID
     */
    PropertyDTO getPropertyById(UUID id);
}