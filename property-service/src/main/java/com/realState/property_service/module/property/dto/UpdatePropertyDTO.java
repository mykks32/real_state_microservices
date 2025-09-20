package com.realState.property_service.module.property.dto;

import java.util.UUID;
import com.realState.property_service.database.enums.StatusEnum;
import com.realState.property_service.database.enums.TypeEnum;
import com.realState.property_service.module.location.dto.UpdateLocationDTO;
import jakarta.validation.Valid;

/**
 * DTO for updating Property details.
 * All fields are optional for partial updates.
 */
public class UpdatePropertyDTO {

    private String title;
    private String description;
    private TypeEnum type;
    private StatusEnum status;

    @Valid
    private UpdateLocationDTO location;

    private UUID ownerId;

    // Getters and Setters
    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public TypeEnum getType() {
        return type;
    }

    public void setType(TypeEnum type) {
        this.type = type;
    }

    public StatusEnum getStatus() {
        return status;
    }

    public void setStatus(StatusEnum status) {
        this.status = status;
    }

    public UpdateLocationDTO getLocation() {
        return location;
    }

    public void setLocation(UpdateLocationDTO location) {
        this.location = location;
    }

    public UUID getOwnerId() {
        return ownerId;
    }

    public void setOwnerId(UUID ownerId) {
        this.ownerId = ownerId;
    }
}