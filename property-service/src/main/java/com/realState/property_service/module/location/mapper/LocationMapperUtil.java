package com.realState.property_service.module.location.mapper;

import org.springframework.stereotype.Component;

import com.realState.property_service.common.exceptions.location.LocationMappingException;
import com.realState.property_service.database.entity.Location;
import com.realState.property_service.module.location.dto.CreateLocationDTO;

/**
 * Mapper utility class for converting Location DTOs to Location entities.
 * Handles mapping errors and throws custom LocationMappingException when mapping fails.
 */
@Component
public class LocationMapperUtil {

    /**
     * Default constructor for Spring.
     */
    public LocationMapperUtil() {}

    /**
     * Maps a CreateLocationDTO to a Location entity.
     *
     * @param dto the DTO containing location data
     * @return the mapped Location entity
     * @throws LocationMappingException if mapping fails or the input dto is null
     */
    public Location mapToEntity(CreateLocationDTO dto) {
        try {
            if (dto == null) {
                throw new IllegalArgumentException("CreateLocationDTO cannot be null");
            }

            Location location = new Location();
            location.setAddress(dto.getAddress());
            location.setCity(dto.getCity());
            location.setState(dto.getState());
            location.setCountry(dto.getCountry());
            location.setZipcode(dto.getZipcode());
            location.setLatitude(dto.getLatitude());
            location.setLongitude(dto.getLongitude());
            return location;
        } catch (Exception ex) {
            // Wrap any exception in a custom exception for consistent error handling
            throw new LocationMappingException("Failed to map CreateLocationDTO to Location", ex);
        }
    }
}