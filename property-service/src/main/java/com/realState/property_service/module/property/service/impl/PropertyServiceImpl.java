package com.realState.property_service.module.property.service.impl;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.realState.property_service.database.entity.Location;
import com.realState.property_service.database.entity.Property;
import com.realState.property_service.database.repository.PropertyRepository;
import com.realState.property_service.module.location.dto.LocationDTO;
import com.realState.property_service.module.location.service.LocationService;
import com.realState.property_service.module.property.dto.CreatePropertyDTO;
import com.realState.property_service.module.property.dto.PropertyDTO;
import com.realState.property_service.module.property.service.PropertyService;

@Service
public class PropertyServiceImpl implements PropertyService {

    @Autowired
    private PropertyRepository propertyRepository;

    @Autowired
    private LocationService locationService;

    private Property mapToEntity(CreatePropertyDTO dto, Location location) {
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
    }

    @Override
    public PropertyDTO createProperty(CreatePropertyDTO dto) {
        Location location = locationService.createLocation(dto.getLocation());

        Property property = mapToEntity(dto, location);
        property = propertyRepository.save(property);

        PropertyDTO propertyDTO = mapToDto(property);

        return propertyDTO;
    }

    @Override
    public PropertyDTO getPropertyById(UUID id) {
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Property not found"));

        PropertyDTO propertyDTO = mapToDto(property);

        return propertyDTO;
    }

    @Override
    public List<PropertyDTO> getAllProperty() {
        List<Property> properties = propertyRepository.findAll();
        return properties.stream()
                .map(property -> mapToDto(property))
                .collect(Collectors.toList());
    }
}
