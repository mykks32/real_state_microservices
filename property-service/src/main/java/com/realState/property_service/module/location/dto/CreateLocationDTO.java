package com.realState.property_service.module.location.dto;

import com.realState.property_service.database.enums.StateEnum;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateLocationDTO {

    @NotBlank(message = "Address is required")
    @Size(max = 255, message = "Address cannot exceed 255 characters")
    private String address;

    @NotBlank(message = "City is required")
    @Size(max = 100, message = "City cannot exceed 100 characters")
    private String city;

    @NotNull(message = "State is required")
    private StateEnum state; // Enum: Bagmati, Gandaki, etc.

    @NotBlank(message = "Country is required")
    private String country = "Nepal";

    @PositiveOrZero(message = "Zipcode must be zero or positive")
    private int zipcode = 44200;

    // Optional latitude & longitude
    private Float lattitude;

    private Float longitude;
}