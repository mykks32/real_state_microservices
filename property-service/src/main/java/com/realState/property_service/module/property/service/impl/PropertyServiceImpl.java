package com.realState.property_service.module.property.service.impl;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.realState.property_service.database.entity.Location;
import com.realState.property_service.database.entity.Property;
import com.realState.property_service.database.enums.ApprovalStatusEnum;
import com.realState.property_service.database.repository.PropertyRepository;
import com.realState.property_service.module.location.dto.LocationDTO;
import com.realState.property_service.module.location.service.LocationService;
import com.realState.property_service.module.property.dto.CreatePropertyDTO;
import com.realState.property_service.module.property.dto.PropertyDTO;
import com.realState.property_service.module.property.dto.UpdatePropertyDTO;
import com.realState.property_service.module.property.service.PropertyService;

@Service
public class PropertyServiceImpl implements PropertyService {

    @Autowired
    private PropertyRepository propertyRepository;

    @Autowired
    private LocationService locationService;

    // Map DTO to Entity
    private Property mapToEntity(CreatePropertyDTO dto, Location location) {
        Property property = new Property();
        property.setTitle(dto.getTitle());
        property.setDescription(dto.getDescription());
        property.setType(dto.getType());
        property.setStatus(dto.getStatus());
        property.setApprovalStatus(dto.getApprovalStatus());
        property.setLocation(location);
        property.setOwnerId(dto.getOwnerId());
        return property;
    }

    // Map Entity to DTO
    private PropertyDTO mapToDto(Property property) {
        PropertyDTO dto = new PropertyDTO();
        dto.setId(property.getId());
        dto.setTitle(property.getTitle());
        dto.setDescription(property.getDescription());
        dto.setType(property.getType());
        dto.setApprovalStatus(property.getApprovalStatus());
        dto.setStatus(property.getStatus());
        dto.setOwnerId(property.getOwnerId());

        Location location = property.getLocation();
        if (location != null) {
            LocationDTO locationDTO = new LocationDTO();
            locationDTO.setId(location.getId());
            locationDTO.setAddress(location.getAddress());
            locationDTO.setCity(location.getCity());
            locationDTO.setState(location.getState());
            locationDTO.setCountry(location.getCountry());
            locationDTO.setZipcode(location.getZipcode());
            locationDTO.setLatitude(location.getLatitude());
            locationDTO.setLongitude(location.getLongitude());
            dto.setLocation(locationDTO);
        }
        ;
        return dto;
    }

    // Seller
    // 1. CREATE
    @Override
    public PropertyDTO createProperty(CreatePropertyDTO dto) {
        Location location = locationService.createLocation(dto.getLocation());
        Property property = mapToEntity(dto, location);
        property = propertyRepository.save(property);
        return mapToDto(property);
    }

    // 2. READ by ID
    @Override
    public PropertyDTO getPropertyById(UUID id) {
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Property not found"));
        return mapToDto(property);
    }

    // 3. READ all
    @Override
    public List<PropertyDTO> getAllOwnerProperty(UUID ownerId) {
        return propertyRepository.findByOwnerId(ownerId)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    // 4. UPDATE
    @Override
    public PropertyDTO updatePropertyById(UUID id, UpdatePropertyDTO dto) {
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Property not found"));

        if (dto.getTitle() != null)
            property.setTitle(dto.getTitle());
        if (dto.getDescription() != null)
            property.setDescription(dto.getDescription());
        if (dto.getType() != null)
            property.setType(dto.getType());
        if (dto.getStatus() != null)
            property.setStatus(dto.getStatus());
        if (dto.getOwnerId() != null)
            property.setOwnerId(dto.getOwnerId());

        if (dto.getLocation() != null) {
            Location updatedLocation = locationService.updateLocation(property.getLocation().getId(),
                    dto.getLocation());
            property.setLocation(updatedLocation);
        }

        property = propertyRepository.save(property);
        return mapToDto(property);
    }

    // Approval Request
    @Override
    public void submitApprovalRequest(UUID id) {
        // Fetch the property by ID
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Property not found"));

        property.setApprovalStatus(ApprovalStatusEnum.pending_approval);

        propertyRepository.save(property);
    }

    // Admin
    // 1. Get all pending approval property
    public List<PropertyDTO> getPropertyPendingApproval() {
        List<Property> pendingProperties = propertyRepository.findByApprovalStatus(ApprovalStatusEnum.pending_approval);
        return pendingProperties.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    // 2. Approve property
    @Override
    public void approveProperty(UUID id) {
        // Fetch the property by ID
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Property not found"));

        property.setApprovalStatus(ApprovalStatusEnum.approved);

        propertyRepository.save(property);
    }

    // 3. Reject property
    public void rejectProperty(UUID id) {
        // Fetch the property by ID
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Property not found"));

        property.setApprovalStatus(ApprovalStatusEnum.rejected);

        propertyRepository.save(property);
    }

    // 4. Archived property
    public void archiveProperty(UUID id) {
        // Fetch the property by ID
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Property not found"));

        property.setApprovalStatus(ApprovalStatusEnum.archived);

        propertyRepository.save(property);
    }

    // 5. Delete property
    @Override
    public void deletePropertyById(UUID id) {
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Property not found"));
        propertyRepository.delete(property);
    }

    // 6. Get all Property
        public List<PropertyDTO> getAllProperty() {
        return propertyRepository.findAll()
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }


    // Buyer
    // 1. Get approved property
    public List<PropertyDTO> getApprovedProperty() {
        List<Property> pendingProperties = propertyRepository.findByApprovalStatus(ApprovalStatusEnum.approved);
        return pendingProperties.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    // DELETE

}