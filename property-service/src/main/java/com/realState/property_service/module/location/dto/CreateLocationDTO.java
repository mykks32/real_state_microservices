package com.realState.property_service.module.location.dto;

import com.realState.property_service.database.enums.StateEnum;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class CreateLocationDTO {

    @NotBlank(message = "Address is required")
    @Size(max = 255, message = "Address cannot exceed 255 characters")
    private String address;

    @NotBlank(message = "City is required")
    @Size(max = 100, message = "City cannot exceed 100 characters")
    private String city;

    @NotNull(message = "State is required")
    private StateEnum state;

    private String country;
    private Integer zipcode;
    private Float lattitude;
    private Float longitude;

    // Custom constructor to set defaults
    public CreateLocationDTO(String address, String city, StateEnum state) {
        this.address = address;
        this.city = city;
        this.state = state;
        this.country = "Nepal";
        this.zipcode = 44200;
    }
}