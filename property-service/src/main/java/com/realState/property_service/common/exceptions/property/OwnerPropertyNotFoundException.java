package com.realState.property_service.common.exceptions.property;

/**
 * Thrown when an owner does not have any properties.
 */
public class OwnerPropertyNotFoundException extends RuntimeException {
    public OwnerPropertyNotFoundException(String message) {
        super(message);
    }
}
