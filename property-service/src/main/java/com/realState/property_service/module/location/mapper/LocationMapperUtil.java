package com.realState.property_service.module.location.mapper;

import org.springframework.stereotype.Component;

import com.realState.property_service.database.entity.Location;
import com.realState.property_service.module.location.dto.CreateLocationDTO;

@Component
public class LocationMapperUtil {
    public LocationMapperUtil() {}

    public Location mapToEntity(CreateLocationDTO dto) {
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

}
