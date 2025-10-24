package com.realState.property_service.module.property.dto;

import com.realState.property_service.database.enums.StateEnum;
import com.realState.property_service.database.enums.StatusEnum;
import com.realState.property_service.database.enums.TypeEnum;

public class PropertyFilterDTO {
    private StatusEnum status;
    private TypeEnum type;
    private StateEnum state;
    private int page;
    private int size;

    public PropertyFilterDTO() {}

    public PropertyFilterDTO(StatusEnum status, TypeEnum type, StateEnum state, int page, int size) {
        this.status = status;
        this.type = type;
        this.state = state;
        this.page = page;
        this.size = size;
    }

    // getter & setter
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

    public StateEnum getState() {
        return state;
    }

    public void setState(StateEnum state) {
        this.state = state;
    }

    public int getPage() {
        return page;
    }

    public void setPage(int page) {
        this.page = page;
    }

    public int getSize() {
        return size;
    }

    public void setSize(int size) {
        this.size = size;
    }
}
