package com.realState.property_service.module.property.service;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.realState.property_service.module.property.dto.CreatePropertyDTO;
import com.realState.property_service.module.property.dto.PropertyDTO;
import com.realState.property_service.module.property.dto.UpdatePropertyDTO;

@Service
public interface PropertyService {

    // Seller 
    // 1. Create Property
    PropertyDTO createProperty(CreatePropertyDTO dto);

    // 2. Get all seller property
    List<PropertyDTO> getAllOwnerProperty(UUID owner_id);

    // 3. Update property by id
    PropertyDTO updatePropertyById(UUID id, UpdatePropertyDTO dto);

    // 4. Submit Approval Request
    void submitApprovalRequest(UUID id);


    // Admin
    // 1. Get Pending Approval Property
    List<PropertyDTO> getPropertyPendingApproval();

    // 2. Approve Property
    void approveProperty(UUID id);

    // 3. Reject Property
    void rejectProperty(UUID id);

    // 4. Archive Property
    void archiveProperty(UUID id);

    // 5. Delete Property
    void deletePropertyById(UUID id);

    // 6. Get All Property
    List<PropertyDTO> getAllProperty();

    // Buyer
    // 1. Get approved property
    List<PropertyDTO> getApprovedProperty();

    // 2. Get Property By Id
    PropertyDTO getPropertyById(UUID id);
} 
