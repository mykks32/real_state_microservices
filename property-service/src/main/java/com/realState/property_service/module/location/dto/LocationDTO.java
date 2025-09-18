package com.realState.property_service.module.location.dto;

import com.realState.property_service.database.enums.StateEnum;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LocationDTO {
    private Long id;
    private String address;
    private String city;
    private StateEnum state;
    private String country;
    private int zipcode;
    private Float latitude;
    private Float longitude;
}