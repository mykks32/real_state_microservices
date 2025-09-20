package com.realState.property_service.module.location.service.impl;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.realState.property_service.common.exceptions.location.LocationCreationException;
import com.realState.property_service.common.exceptions.location.LocationNotFoundException;
import com.realState.property_service.common.exceptions.location.LocationSaveException;
import com.realState.property_service.database.entity.Location;
import com.realState.property_service.database.repository.LocationRepository;
import com.realState.property_service.module.location.dto.CreateLocationDTO;
import com.realState.property_service.module.location.dto.UpdateLocationDTO;
import com.realState.property_service.module.location.mapper.LocationMapperUtil;
import com.realState.property_service.module.location.service.LocationService;

/**
 * Implementation of LocationService for creating and updating locations.
 */
@Service
public class LocationServiceImpl implements LocationService {

    private static final Logger logger = LoggerFactory.getLogger(LocationServiceImpl.class);

    private final LocationRepository locationRepository;
    private final LocationMapperUtil locationMapperUtil;

    public LocationServiceImpl(LocationRepository locationRepository, LocationMapperUtil locationMapperUtil) {
        this.locationRepository = locationRepository;
        this.locationMapperUtil = locationMapperUtil;
    }

    /**
     * Creates a new Location.
     *
     * @param dto the DTO containing location data
     * @return the saved Location entity
     * @throws LocationCreationException if creation fails
     */
    @Override
    @Transactional
    public Location createLocation(CreateLocationDTO dto) {
        try {
            Location location = locationMapperUtil.mapToEntity(dto);
            Location savedLocation = locationRepository.save(location);
            logger.info("Location created successfully with ID={}", savedLocation.getId());
            return savedLocation;
        } catch (Exception ex) {
            logger.error("Failed to create location", ex);
            throw new LocationCreationException("Failed to create location", ex);
        }
    }

    /**
     * Updates an existing Location by its ID.
     *
     * @param id  the location ID
     * @param dto the DTO containing update data
     * @return the updated Location entity
     * @throws LocationNotFoundException if the location does not exist
     * @throws LocationSaveException     if the update fails
     */
    @Override
    @Transactional
    public Location updateLocation(Long id, UpdateLocationDTO dto) {
        try {
            Location location = locationRepository.findById(id)
                    .orElseThrow(() -> new LocationNotFoundException("Location not found with ID=" + id));

            if (dto.getAddress() != null) location.setAddress(dto.getAddress());
            if (dto.getCity() != null) location.setCity(dto.getCity());
            if (dto.getState() != null) location.setState(dto.getState());
            if (dto.getCountry() != null) location.setCountry(dto.getCountry());
            if (dto.getZipcode() != null) location.setZipcode(dto.getZipcode());
            if (dto.getLatitude() != null) location.setLatitude(dto.getLatitude());
            if (dto.getLongitude() != null) location.setLongitude(dto.getLongitude());

            Location updatedLocation = locationRepository.save(location);
            logger.info("Location updated successfully with ID={}", updatedLocation.getId());
            return updatedLocation;
        } catch (LocationNotFoundException ex) {
            logger.warn("Location update failed: {}", ex.getMessage());
            throw ex;
        } catch (Exception ex) {
            logger.error("Failed to update location with ID={}", id, ex);
            throw new LocationSaveException("Failed to update location with ID=" + id, ex);
        }
    }
}