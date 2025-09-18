package com.realState.property_service.module.property.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.realState.property_service.database.entity.Location;
import com.realState.property_service.database.entity.Property;
import com.realState.property_service.database.repository.PropertyRepository;
import com.realState.property_service.module.location.dto.LocationDTO;
import com.realState.property_service.module.location.service.LocationService;
import com.realState.property_service.module.property.dto.CreatePropetyDTO;
import com.realState.property_service.module.property.dto.PropertyDTO;
import com.realState.property_service.module.property.service.PropertyService;

@Service
public class PropertyServiceImpl implements PropertyService {

    @Autowired
    private PropertyRepository propertyRepository;

    @Autowired
    private LocationService locationService;

    private Property mapToEntity(CreatePropetyDTO dto, Location location) {
        Property property = new Property();

        property.setTitle((dto.getTitle()));
        property.setDescription(dto.getDescription());
        property.setType(dto.getType());
        property.setStatus(dto.getStatus());
        property.setLocation(location);
        return property;
    }

    private PropertyDTO mapToDto(Property property) {
        PropertyDTO dto = new PropertyDTO();

        dto.setId(property.getId());
        dto.setTitle(property.getTitle());
        dto.setDescription(property.getDescription());
        dto.setType(property.getType());
        dto.setStatus(property.getStatus());

        Location location = property.getLocation();
        if (location != null) {
            dto.setLocation(new LocationDTO(
                    location.getId(),
                    location.getAddress(),
                    location.getCity(),
                    location.getState(),
                    location.getCountry(),
                    location.getZipcode(),
                    location.getLatitude(),
                    location.getLongitude()));
        }
        return dto;
    }

    @Override
    public PropertyDTO createProperty(CreatePropetyDTO dto) {
        Location location = locationService.createLocation(dto.getLocation());

        Property property = mapToEntity(dto, location);
        property = propertyRepository.save(property);

        PropertyDTO propertyDTO = mapToDto(property);

        return propertyDTO;
    }
}
