package com.realState.property_service.module.location.service;

import com.realState.property_service.database.entity.Location;
import com.realState.property_service.module.location.dto.CreateLocationDTO;
import com.realState.property_service.module.location.dto.UpdateLocationDTO;

public interface LocationService {

    // Create Location
    Location createLocation(CreateLocationDTO dto);

    // find Location
    Location getLocation(Long id);

    // Update Location
    Location updateLocation(Long id, UpdateLocationDTO dto);

    // Delete Location
    void deleteLocation(Long id);

    
}