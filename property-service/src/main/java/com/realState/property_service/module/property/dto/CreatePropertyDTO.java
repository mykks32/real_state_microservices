package com.realState.property_service.module.property.dto;

import java.util.UUID;
import com.realState.property_service.database.enums.ApprovalStatusEnum;
import com.realState.property_service.database.enums.StatusEnum;
import com.realState.property_service.database.enums.TypeEnum;
import com.realState.property_service.module.location.dto.CreateLocationDTO;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/**
 * DTO for creating a new Property.
 */
public class CreatePropertyDTO {

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

    @NotNull(message = "Owner id is required")
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

    public CreateLocationDTO getLocation() {
        return location;
    }

    public void setLocation(CreateLocationDTO location) {
        this.location = location;
    }

    public UUID getOwnerId() {
        return ownerId;
    }

    public void setOwnerId(UUID ownerId) {
        this.ownerId = ownerId;
    }
}