package com.realState.property_service.module.location.service;

import com.realState.property_service.database.entity.Location;
import com.realState.property_service.module.location.dto.CreateLocationDTO;
import com.realState.property_service.module.location.dto.UpdateLocationDTO;

/**
 * Service interface for handling Location-related operations.
 */
public interface LocationService {

    /**
     * Creates a new Location.
     *
     * @param dto the DTO containing location details
     * @return the saved Location entity
     */
    Location createLocation(CreateLocationDTO dto);

    /**
     * Updates an existing Location.
     *
     * @param id  the ID of the Location to update
     * @param dto the DTO containing updated location details
     * @return the updated Location entity
     */
    Location updateLocation(Long id, UpdateLocationDTO dto);
}