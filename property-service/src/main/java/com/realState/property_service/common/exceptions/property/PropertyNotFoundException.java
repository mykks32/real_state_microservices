package com.realState.property_service.common.exceptions.property;

/**
 * Thrown when a property with the given ID is not found.
 */
public class PropertyNotFoundException extends RuntimeException {
    public PropertyNotFoundException(String message) {
        super(message);
    }
}
