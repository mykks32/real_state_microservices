package com.realState.property_service.module.property.dto;

import com.realState.property_service.database.enums.StatusEnum;
import com.realState.property_service.database.enums.TypeEnum;
import com.realState.property_service.module.location.dto.CreateLocationDTO;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreatePropetyDTO {
    @NotBlank(message = "Title is required")
    @Size(max = 150, message = "Title cannot exceed 150 characters")
    private String title;

    @Size(max = 500, message = "Description cannot exceed 500 characters")
    private String description;

    @NotNull(message = "Property type is required")
    private TypeEnum type = TypeEnum.Land;

    @NotNull(message = "Property status is required")
    private StatusEnum status = StatusEnum.Available;

    @NotNull(message = "Location is required")
    @Valid
    private CreateLocationDTO location;
}