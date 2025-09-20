package com.realState.property_service.module.property.mapper;

import org.springframework.stereotype.Component;

import com.realState.property_service.database.entity.Location;
import com.realState.property_service.database.entity.Property;
import com.realState.property_service.module.location.dto.LocationDTO;
import com.realState.property_service.module.property.dto.CreatePropertyDTO;
import com.realState.property_service.module.property.dto.PropertyDTO;

@Component
public class PropertyMapperUtil {
    private PropertyMapperUtil() {}

    // Map DTO to Entity
    public Property mapToEntity(CreatePropertyDTO dto, Location location) {
        Property property = new Property();
        property.setTitle(dto.getTitle());
        property.setDescription(dto.getDescription());
        property.setType(dto.getType());
        property.setStatus(dto.getStatus());
        property.setApprovalStatus(dto.getApprovalStatus());
        property.setLocation(location);
        property.setOwnerId(dto.getOwnerId());
        return property;
    }

    // Map Entity to DTO
    public PropertyDTO mapToDto(Property property) {
        PropertyDTO dto = new PropertyDTO();
        dto.setId(property.getId());
        dto.setTitle(property.getTitle());
        dto.setDescription(property.getDescription());
        dto.setType(property.getType());
        dto.setApprovalStatus(property.getApprovalStatus());
        dto.setStatus(property.getStatus());
        dto.setOwnerId(property.getOwnerId());

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
        ;
        return dto;
    }
}
