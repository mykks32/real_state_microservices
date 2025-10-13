package com.realState.property_service.module.property.service.impl;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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
    public List<PropertyDTO> getAllOwnerProperty(UUID ownerId) {
        try {
            if (ownerId == null) {
                throw new IllegalArgumentException("Owner ID cannot be null");
            }

            List<Property> properties = propertyRepository.findByOwnerId(ownerId);
            if (properties.isEmpty()) {
                throw new OwnerPropertyNotFoundException("No properties found for ownerId=" + ownerId);
            }

            List<PropertyDTO> propertyDTOs = properties.stream()
                    .map(propertyMapperUtil::mapToDto)
                    .collect(Collectors.toList());
            logger.info("Found {} properties for ownerId={}", propertyDTOs.size(), ownerId);
            return propertyDTOs;
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
    public List<PropertyDTO> getPropertyPendingApproval() {
        try {
            List<Property> pendingProperties = propertyRepository
                    .findByApprovalStatus(ApprovalStatusEnum.pending_approval);

            List<PropertyDTO> propertyDTOs = pendingProperties.stream()
                    .map(propertyMapperUtil::mapToDto)
                    .collect(Collectors.toList());

            logger.info("Fetched {} properties pending approval", propertyDTOs.size());
            return propertyDTOs;

        } catch (Exception ex) {
            logger.error("Unexpected error fetching pending approval properties", ex);
            throw new PropertyFetchException("Failed to fetch pending approval properties", ex);
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
    public List<PropertyDTO> getAllProperty() {
        try {
            List<Property> properties = propertyRepository.findAll();
            List<PropertyDTO> propertyDTOs = properties.stream()
                    .map(propertyMapperUtil::mapToDto)
                    .collect(Collectors.toList());

            logger.info("Fetched {} properties from the database", propertyDTOs.size());
            return propertyDTOs;
        } catch (Exception ex) {
            logger.error("Failed to fetch all properties", ex);
            throw new PropertySaveException("Failed to fetch all properties", ex);
        }
    }

    // ================== ADMIN ==================

    /**
     * 1. Retrieves all approved properties for buyers.
     *
     * @return list of approved PropertyDTOs
     * @throws PropertySaveException if fetching approved properties fails
     */
    @Override
    @Transactional(readOnly = true)
    public List<PropertyDTO> getApprovedProperty() {
        try {
            List<Property> approvedProperties = propertyRepository.findByApprovalStatus(ApprovalStatusEnum.approved);
            List<PropertyDTO> propertyDTOs = approvedProperties.stream()
                    .map(propertyMapperUtil::mapToDto)
                    .collect(Collectors.toList());

            logger.info("Fetched {} approved properties", propertyDTOs.size());
            return propertyDTOs;
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

}