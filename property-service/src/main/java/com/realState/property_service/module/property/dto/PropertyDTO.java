package com.realState.property_service.module.property.dto;

import java.util.UUID;

import com.realState.property_service.database.enums.ApprovalStatusEnum;
import com.realState.property_service.database.enums.StatusEnum;
import com.realState.property_service.database.enums.TypeEnum;
import com.realState.property_service.module.location.dto.LocationDTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PropertyDTO {
    private UUID id;
    private String title;
    private String description;
    private TypeEnum type;
    private StatusEnum status;
    private ApprovalStatusEnum approval_satus;
    private LocationDTO location;
    private UUID owner_id;
}
