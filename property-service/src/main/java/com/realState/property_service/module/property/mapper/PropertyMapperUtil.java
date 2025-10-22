package com.realState.property_service.module.property.mapper;

import org.springframework.stereotype.Component;

import com.realState.property_service.common.exceptions.property.PropertyMappingException;
import com.realState.property_service.database.entity.Location;
import com.realState.property_service.database.entity.Property;
import com.realState.property_service.module.location.dto.LocationDTO;
import com.realState.property_service.module.property.dto.CreatePropertyDTO;
import com.realState.property_service.module.property.dto.PropertyDTO;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Utility class for mapping Property entities to DTOs and vice versa.
 * <p>
 * Handles mapping for Property and associated Location entities.
 */
@Component
public class PropertyMapperUtil {

    private static final Logger logger = LoggerFactory.getLogger(PropertyMapperUtil.class);

    // Private constructor to prevent instantiation
    private PropertyMapperUtil() {
    }

    /**
     * Maps a CreatePropertyDTO to a Property entity.
     *
     * @param dto      the DTO containing property creation data
     * @param location the Location entity associated with the property
     * @return Property entity populated with DTO data
     * @throws PropertyMappingException if mapping fails
     */
    public Property mapToEntity(CreatePropertyDTO dto, Location location) {
        try {
            if (dto == null) {
                throw new PropertyMappingException("CreatePropertyDTO cannot be null");
            }
            Property property = new Property();
            property.setTitle(dto.getTitle());
            property.setDescription(dto.getDescription());
            property.setType(dto.getType());
            property.setStatus(dto.getStatus());
            property.setApprovalStatus(dto.getApprovalStatus());
            property.setLocation(location);
            property.setOwnerId(dto.getOwnerId());
            return property;
        } catch (Exception ex) {
            logger.error("Failed to map CreatePropertyDTO to Property entity", ex);
            throw new PropertyMappingException("Error mapping property DTO to entity", ex);
        }
    }

    /**
     * Maps a Property entity to a PropertyDTO.
     *
     * @param property the Property entity to map
     * @return PropertyDTO containing property data
     * @throws PropertyMappingException if mapping fails
     */
    public PropertyDTO mapToDto(Property property) {
        try {
            if (property == null) {
                throw new PropertyMappingException("Property entity cannot be null");
            }

            PropertyDTO dto = new PropertyDTO();
            dto.setId(property.getId());
            dto.setTitle(property.getTitle());
            dto.setDescription(property.getDescription());
            dto.setType(property.getType());
            dto.setApprovalStatus(property.getApprovalStatus());
            dto.setStatus(property.getStatus());
            dto.setOwnerId(property.getOwnerId());
            dto.setCreatedAt(property.getCreatedAt());
            dto.setUpdatedAt(property.getUpdatedAt());

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

            return dto;
        } catch (Exception ex) {
            logger.error("Failed to map Property entity to PropertyDTO", ex);
            throw new PropertyMappingException("Error mapping property entity to DTO", ex);
        }
    }
}