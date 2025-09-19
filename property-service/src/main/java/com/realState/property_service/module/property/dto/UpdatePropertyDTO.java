package com.realState.property_service.module.property.dto;

import java.util.UUID;

import com.realState.property_service.database.enums.StatusEnum;
import com.realState.property_service.database.enums.TypeEnum;
import com.realState.property_service.module.location.dto.UpdateLocationDTO;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdatePropertyDTO {

    // All fields optional for partial update
    private String title;
    private String description;
    private TypeEnum type;
    private StatusEnum status;

    @Valid
    private UpdateLocationDTO location;

    private UUID ownerId;
}