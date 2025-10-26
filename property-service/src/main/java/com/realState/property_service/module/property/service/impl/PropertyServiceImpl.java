package com.realState.property_service.module.property.service.impl;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import com.realState.property_service.common.utils.ApiResponse;
import com.realState.property_service.module.property.dto.PropertyFilterDTO;
import com.realState.property_service.module.property.service.specification.PropertySpecification;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.realState.property_service.common.exceptions.location.LocationCreationException;
import com.realState.property_service.common.exceptions.property.OwnerPropertyNotFoundException;
import com.realState.property_service.common.exceptions.property.PropertyFetchException;
import com.realState.property_service.common.exceptions.property.PropertyMappingException;
import com.realState.property_service.common.exceptions.property.PropertyNotFoundException;
import com.realState.property_service.common.exceptions.property.PropertySaveException;
import com.realState.property_service.database.entity.Location;
import com.realState.property_service.database.entity.Property;
import com.realState.property_service.database.enums.ApprovalStatusEnum;
import com.realState.property_service.database.repository.PropertyRepository;
import com.realState.property_service.module.location.service.LocationService;
import com.realState.property_service.module.property.dto.CreatePropertyDTO;
import com.realState.property_service.module.property.dto.PropertyDTO;
import com.realState.property_service.module.property.dto.UpdatePropertyDTO;
import com.realState.property_service.module.property.mapper.PropertyMapperUtil;
import com.realState.property_service.module.property.service.PropertyService;

import org.springframework.transaction.annotation.Transactional;

@Service
public class PropertyServiceImpl implements PropertyService {

    private final PropertyRepository propertyRepository;
    private final LocationService locationService;
    private final PropertyMapperUtil propertyMapperUtil;
    private static final Logger logger = LoggerFactory.getLogger(PropertyServiceImpl.class);

    private void validateFilterDTO(PropertyFilterDTO filterDTO) {
        if (filterDTO == null) {
            throw new IllegalArgumentException("PropertyFilterDTO cannot be null");
        }
        if (filterDTO.getPage() < 0) {
            throw new IllegalArgumentException("Page number cannot be negative");
        }
        if (filterDTO.getSize() <= 0 || filterDTO.getSize() > 100) {
            throw new IllegalArgumentException("Size must be between 1 and 100");
        }
    }

    public PropertyServiceImpl(PropertyRepository propertyRepository, LocationService locationService,
            PropertyMapperUtil propertyMapperUtil) {
        this.propertyRepository = propertyRepository;
        this.locationService = locationService;
        this.propertyMapperUtil = propertyMapperUtil;
    }

    // ================== SELLER ==================

    /**
     * 1. Creates a new property for a seller.
     */
    @Override
    @Transactional
    public PropertyDTO createProperty(CreatePropertyDTO dto) {
        try {
            Location location = locationService.createLocation(dto.getLocation());
            Property property = propertyMapperUtil.mapToEntity(dto, location);
            property.setApprovalStatus(ApprovalStatusEnum.draft);
            property = propertyRepository.save(property);
            logger.info("Property created successfully with id={}", property.getId());
            return propertyMapperUtil.mapToDto(property);
        } catch (LocationCreationException | PropertyMappingException ex) {
            logger.error("Property creation failed: {}", ex.getMessage(), ex);
            throw ex;
        } catch (Exception ex) {
            logger.error("Unexpected error during property creation", ex);
            throw new PropertySaveException("Failed to create property");
        }
    }

    /**
     * 2. Retrieves all properties of a specific owner.
     */
    @Override
    @Transactional(readOnly = true)
    public ApiResponse<List<PropertyDTO>> getAllOwnerProperty(UUID ownerId, int page, int size) {
        try {
            if (ownerId == null) {
                throw new IllegalArgumentException("Owner ID cannot be null");
            }

            Pageable pageable = PageRequest.of(page, size, Sort.by("updatedAt").descending());

            Page<Property> properties = propertyRepository.findByOwnerId(ownerId, pageable);

            if (properties.isEmpty()) {
                throw new OwnerPropertyNotFoundException("No properties found for ownerId=" + ownerId);
            }

            List<PropertyDTO> propertyDTOs = properties.getContent().stream()
                    .map(propertyMapperUtil::mapToDto)
                    .collect(Collectors.toList());

            // Build meta information
            ApiResponse.MetaData meta = new ApiResponse.MetaData(
                    properties.getTotalElements(),
                    properties.getTotalPages(),
                    properties.getNumber() + 1,
                    properties.getSize()
            );

            logger.info("Fetched {} all properties (page {}/{}) of OwnerID",
                    propertyDTOs.size(), page + 1, properties.getTotalPages());

            // Return success response with data and meta
            return ApiResponse.success(propertyDTOs, meta, "Fetched all properties successfully");
        } catch (OwnerPropertyNotFoundException | IllegalArgumentException ex) {
            logger.warn("Property fetch warning: {}", ex.getMessage(), ex);
            throw ex;
        } catch (Exception ex) {
            logger.error("Unexpected error fetching properties for ownerId={}", ownerId, ex);
            throw new RuntimeException("Failed to fetch properties");
        }
    }

    /**
     * 3. Updates an existing property.
     */
    @Override
    @Transactional
    public PropertyDTO updatePropertyById(UUID id, UpdatePropertyDTO dto) {
        try {
            Property property = propertyRepository.findById(id)
                    .orElseThrow(() -> new PropertyNotFoundException("Property not found with id=" + id));

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
            logger.info("Property updated successfully with id={}", id);
            return propertyMapperUtil.mapToDto(property);

        } catch (PropertyNotFoundException ex) {
            logger.warn("Property not found for update: {}", ex.getMessage());
            throw ex;
        } catch (Exception ex) {
            logger.error("Failed to update property id={}", id, ex);
            throw new PropertySaveException("Failed to update property");
        }
    }

    /**
     * 4. Submits a property for admin approval.
     */
    @Override
    @Transactional
    public void submitApprovalRequest(UUID id) {
        try {
            Property property = propertyRepository.findById(id)
                    .orElseThrow(() -> new PropertyNotFoundException("Property not found with id=" + id));
            property.setApprovalStatus(ApprovalStatusEnum.pending_approval);
            propertyRepository.save(property);
            logger.info("Approval request submitted for property id={}", id);
        } catch (PropertyNotFoundException ex) {
            logger.warn("Approval request failed: {}", ex.getMessage());
            throw ex;
        } catch (Exception ex) {
            logger.error("Failed to submit approval request for property id={}", id, ex);
            throw new RuntimeException("Failed to submit approval request");
        }
    }

    // ================== ADMIN ==================

    /**
     * 1. Fetch all properties pending admin approval.
     *
     * @return List of PropertyDTO
     * @throws PropertyFetchException if fetching fails
     */
    @Override
    @Transactional(readOnly = true)
    public ApiResponse<List<PropertyDTO>> getPropertyPendingApproval(int page, int size) {
        try {
            // Create pageable object
            Pageable pageable = PageRequest.of(page, size, Sort.by("updatedAt").descending());

            // Fetch paginated pending properties
            Page<Property> pendingPropertiesPage = propertyRepository.findByApprovalStatus(
                    ApprovalStatusEnum.pending_approval,
                    pageable
            );

            // Map to DTOs
            List<PropertyDTO> propertyDTOs = pendingPropertiesPage.getContent().stream()
                    .map(propertyMapperUtil::mapToDto)
                    .collect(Collectors.toList());

            // Build meta information
            ApiResponse.MetaData meta = new ApiResponse.MetaData(
                    pendingPropertiesPage.getTotalElements(),
                    pendingPropertiesPage.getTotalPages(),
                    pendingPropertiesPage.getNumber() + 1,
                    pendingPropertiesPage.getSize()
            );

            logger.info("Fetched {} pending properties (page {}/{})",
                    propertyDTOs.size(), page + 1, pendingPropertiesPage.getTotalPages());

            // Return success response with data and meta
            return ApiResponse.success(propertyDTOs, meta, "Fetched pending properties successfully");
        } catch (Exception ex) {
            logger.error("Failed to fetch approved properties", ex);
            throw new PropertyFetchException("Failed to fetch approved properties", ex);
        }
    }

    /**
     * 2. Approves a property by its ID.
     *
     * @param id the property UUID
     * @throws PropertyNotFoundException if the property does not exist
     * @throws PropertySaveException     if saving the property fails
     */
    @Override
    @Transactional
    public void approveProperty(UUID id) {
        try {
            Property property = propertyRepository.findById(id)
                    .orElseThrow(() -> new PropertyNotFoundException("Property not found with id=" + id));

            property.setApprovalStatus(ApprovalStatusEnum.approved);
            propertyRepository.save(property);

            logger.info("Property with ID={} approved successfully", id);
        } catch (PropertyNotFoundException ex) {
            logger.warn("Property with ID={} not found for approval", id, ex);
            throw ex;
        } catch (Exception ex) {
            logger.error("Error approving property with ID={}", id, ex);
            throw new PropertySaveException("Failed to approve property with ID=" + id, ex);
        }
    }

    /**
     * 3. Rejects a property by its ID.
     *
     * @param id the property UUID
     * @throws PropertyNotFoundException if the property does not exist
     * @throws PropertySaveException     if saving the property fails
     */
    @Override
    @Transactional
    public void rejectProperty(UUID id) {
        try {
            Property property = propertyRepository.findById(id)
                    .orElseThrow(() -> new PropertyNotFoundException("Property not found with id=" + id));

            property.setApprovalStatus(ApprovalStatusEnum.rejected);
            propertyRepository.save(property);

            logger.info("Property with ID={} rejected successfully", id);
        } catch (PropertyNotFoundException ex) {
            logger.warn("Property with ID={} not found for rejection", id, ex);
            throw ex;
        } catch (Exception ex) {
            logger.error("Error rejecting property with ID={}", id, ex);
            throw new PropertySaveException("Failed to reject property with ID=" + id, ex);
        }
    }

    /**
     * 4.Archives a property by its ID.
     *
     * @param id the property UUID
     * @throws PropertyNotFoundException if the property does not exist
     * @throws PropertySaveException     if saving the property fails
     */
    @Override
    @Transactional
    public void archiveProperty(UUID id) {
        try {
            Property property = propertyRepository.findById(id)
                    .orElseThrow(() -> new PropertyNotFoundException("Property not found with id=" + id));

            property.setApprovalStatus(ApprovalStatusEnum.archived);
            propertyRepository.save(property);

            logger.info("Property with ID={} archived successfully", id);
        } catch (PropertyNotFoundException ex) {
            logger.warn("Property with ID={} not found for archiving", id, ex);
            throw ex;
        } catch (Exception ex) {
            logger.error("Error archiving property with ID={}", id, ex);
            throw new PropertySaveException("Failed to archive property with ID=" + id, ex);
        }
    }

    /**
     * 5. Deletes a property by its ID.
     *
     * @param id the property UUID
     * @throws PropertyNotFoundException if the property does not exist
     * @throws PropertySaveException     if deleting the property fails
     */
    @Override
    @Transactional
    public void deletePropertyById(UUID id) {
        try {
            Property property = propertyRepository.findById(id)
                    .orElseThrow(() -> new PropertyNotFoundException("Property not found with id=" + id));

            propertyRepository.delete(property);
            logger.info("Property with ID={} deleted successfully", id);
        } catch (PropertyNotFoundException ex) {
            logger.warn("Property with ID={} not found for deletion", id, ex);
            throw ex;
        } catch (Exception ex) {
            logger.error("Error deleting property with ID={}", id, ex);
            throw new PropertySaveException("Failed to delete property with ID=" + id, ex);
        }
    }

    /**
     * 6. Retrieves all properties from the database.
     *
     * @return a list of PropertyDTO
     * @throws PropertySaveException if fetching properties fails
     */
    @Override
    @Transactional(readOnly = true)
    public ApiResponse<List<PropertyDTO>> getAllProperty(int page, int size) {
        try {
            // Create pageable object
            Pageable pageable = PageRequest.of(page, size, Sort.by("updatedAt").descending());

            Page<Property> properties = propertyRepository.findAll(pageable);

            // Map to DTOs
            List<PropertyDTO> propertyDTOs = properties.getContent().stream()
                    .map(propertyMapperUtil::mapToDto)
                    .collect(Collectors.toList());

            // Build meta information
            ApiResponse.MetaData meta = new ApiResponse.MetaData(
                    properties.getTotalElements(),
                    properties.getTotalPages(),
                    properties.getNumber() + 1,
                    properties.getSize()
            );

            logger.info("Fetched {} all properties (page {}/{})",
                    propertyDTOs.size(), page + 1, properties.getTotalPages());

            // Return success response with data and meta
            return ApiResponse.success(propertyDTOs, meta, "Fetched all properties successfully");
        } catch (Exception ex) {
            logger.error("Failed to fetch all properties", ex);
            throw new PropertySaveException("Failed to fetch all properties", ex);
        }
    }

    /**
     * 1. Creates a new property by Admin.
     */
    @Override
    @Transactional
    public PropertyDTO createAdminApprovedProperty(CreatePropertyDTO dto) {
        try {
            Location location = locationService.createLocation(dto.getLocation());
            Property property = propertyMapperUtil.mapToEntity(dto, location);
            property.setApprovalStatus(ApprovalStatusEnum.approved);
            property = propertyRepository.save(property);
            logger.info("Property created successfully by admin with id={}", property.getId());
            return propertyMapperUtil.mapToDto(property);
        } catch (LocationCreationException | PropertyMappingException ex) {
            logger.error("Property creation failed: {}", ex.getMessage(), ex);
            throw ex;
        } catch (Exception ex) {
            logger.error("Unexpected error during property creation", ex);
            throw new PropertySaveException("Failed to create property");
        }
    }

    // ================== BUYER ==================

    /**
     * 1. Retrieves all approved properties for buyers.
     *
     * @return list of approved PropertyDTOs
     * @throws PropertySaveException if fetching approved properties fails
     */
    @Override
    @Transactional(readOnly = true)
    public ApiResponse<List<PropertyDTO>> getApprovedProperty(int page, int size) {
        try {
            // Create pageable object
            Pageable pageable = PageRequest.of(page, size, Sort.by("updatedAt").descending());

            // Fetch paginated approved properties
            Page<Property> approvedPropertiesPage = propertyRepository.findByApprovalStatus(
                    ApprovalStatusEnum.approved,
                    pageable
            );

            // Map to DTOs
            List<PropertyDTO> propertyDTOs = approvedPropertiesPage.getContent().stream()
                    .map(propertyMapperUtil::mapToDto)
                    .collect(Collectors.toList());

            // Build meta information
            ApiResponse.MetaData meta = new ApiResponse.MetaData(
                    approvedPropertiesPage.getTotalElements(),
                    approvedPropertiesPage.getTotalPages(),
                    approvedPropertiesPage.getNumber() + 1,
                    approvedPropertiesPage.getSize()
            );

            logger.info("Fetched pending properties of size:{} page:{} totalPage:{}", propertyDTOs.size(), page + 1, approvedPropertiesPage.getTotalPages());

            // Return success response with data and meta
            return ApiResponse.success(propertyDTOs, meta, "Fetched approved properties successfully");
        } catch (Exception ex) {
            logger.error("Failed to fetch approved properties", ex);
            throw new PropertyFetchException("Failed to fetch approved properties", ex);
        }
    }

    /**
     * 2. Retrieves a property by its ID.
     *
     * @param id the property UUID
     * @return PropertyDTO corresponding to the given ID
     * @throws PropertyNotFoundException if no property exists with the given ID
     */
    @Override
    @Transactional(readOnly = true)
    public PropertyDTO getPropertyById(UUID id) {
        try {
            Property property = propertyRepository.findById(id)
                    .orElseThrow(() -> new PropertyNotFoundException("Property not found with id=" + id));

            logger.info("Fetched property with ID={}", id);
            return propertyMapperUtil.mapToDto(property);
        } catch (PropertyNotFoundException ex) {
            logger.warn("Property with ID={} not found", id, ex);
            throw ex;
        } catch (Exception ex) {
            logger.error("Unexpected error fetching property with ID={}", id, ex);
            throw new PropertyFetchException("Failed to fetch property with ID=" + id, ex);
        }
    }


    /**
     * 3. Retrieves all filtered approved properties for buyers.
     *
     * @return list of approved PropertyDTOs
     * @throws PropertySaveException if fetching approved properties fails
     */
    @Override
    @Transactional(readOnly = true)
    public ApiResponse<List<PropertyDTO>> filterProperties(PropertyFilterDTO filterDTO) {
        try {
            validateFilterDTO(filterDTO);

            Pageable pageable = PageRequest.of(
                    filterDTO.getPage(),
                    filterDTO.getSize(),
                    Sort.by("updatedAt").descending()
            );

            Specification<Property> spec = PropertySpecification.combine(
                    filterDTO.getStatus(),
                    filterDTO.getType(),
                    filterDTO.getState()
            ).and(PropertySpecification.isApproved());

            Page<Property> propertiesPage = propertyRepository.findAll(spec, pageable);

            List<PropertyDTO> propertyDTOs = propertiesPage.getContent().stream()
                    .map(propertyMapperUtil::mapToDto)
                    .collect(Collectors.toList());

            ApiResponse.MetaData meta = new ApiResponse.MetaData(
                    propertiesPage.getTotalElements(),
                    propertiesPage.getTotalPages(),
                    propertiesPage.getNumber() + 1,
                    propertiesPage.getSize()
            );

            logger.info("Filtered properties - status: {}, type: {}, state: {}, found: {}, page: {}",
                    filterDTO.getStatus(), filterDTO.getType(), filterDTO.getState(),
                    propertyDTOs.size(), filterDTO.getPage() + 1);

            return ApiResponse.success(propertyDTOs, meta, "Filtered properties fetched successfully");

        } catch (Exception ex) {
            logger.error("Failed to fetch approved properties");
            throw new PropertyFetchException("Failed to Fetch Properties");
        }
    }
}