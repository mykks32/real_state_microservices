package com.realState.property_service.module.location.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.realState.property_service.database.entity.Location;
import com.realState.property_service.database.repository.LocationRepository;
import com.realState.property_service.module.location.dto.CreateLocationDTO;
import com.realState.property_service.module.location.service.LocationService;

@Service
public class LocationServiceImpl implements LocationService {

    @Autowired
    private LocationRepository locationRepository;

    private Location mapToEntity(CreateLocationDTO dto) {
        Location location = new Location();
        location.setAddress(dto.getAddress());
        location.setCity(dto.getCity());
        location.setState(dto.getState());
        location.setCountry(dto.getCountry());
        location.setZipcode(dto.getZipcode());
        location.setLatitude(dto.getLatitude());
        location.setLongitude(dto.getLongitude());
        return location;
    }

    @Override
    public Location createLocation(CreateLocationDTO dto) {
        Location location = mapToEntity(dto);
        return location = locationRepository.save(location);
    }

    @Override
    public Location getLocation(Long id) {
        return locationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Location not found"));
    }

    @Override
    public Location updateLocation(Long id, CreateLocationDTO dto) {
        Location location = locationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Location not found"));

        location.setAddress(dto.getAddress());
        location.setCity(dto.getCity());
        location.setState(dto.getState());
        location.setCountry(dto.getCountry());
        location.setZipcode(dto.getZipcode());
        location.setLatitude(dto.getLatitude());
        location.setLongitude(dto.getLongitude());

        return locationRepository.save(location);
    }

    @Override
    public void deleteLocation(Long id) {
        Location location = locationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Location not found"));
        locationRepository.delete(location);
    }
}