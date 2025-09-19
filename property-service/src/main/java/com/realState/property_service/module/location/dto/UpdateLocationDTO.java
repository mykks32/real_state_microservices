package com.realState.property_service.module.location.dto;

import com.realState.property_service.database.enums.StateEnum;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateLocationDTO {

    // All fields are nullable, meaning optional for update
    private String address;
    private String city;
    private StateEnum state;
    private String country;
    private Integer zipcode;
    private Float latitude;
    private Float longitude;
}