package com.realState.property_service.common.exceptions.location;

/**
 * Thrown when creating a location fails.
 */
public class LocationCreationException extends RuntimeException {
    public LocationCreationException(String message) {
        super(message);
    }

    public LocationCreationException(String message, Throwable cause) {
        super(message, cause);
    }
}
