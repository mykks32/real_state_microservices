package com.realState.property_service.common.exceptions.location;

public class LocationSaveException extends RuntimeException {
    public LocationSaveException(String message) {
        super(message);
    }

    public LocationSaveException(String message, Throwable cause) {
        super(message, cause);
    }
}