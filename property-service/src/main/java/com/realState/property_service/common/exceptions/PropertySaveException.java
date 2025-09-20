package com.realState.property_service.common.exceptions;

/**
 * Thrown when saving a property to the database fails.
 */
public class PropertySaveException extends RuntimeException {
    public PropertySaveException(String message) {
        super(message);
    }

    public PropertySaveException(String message, Throwable cause) {
        super(message, cause);
    }
}
