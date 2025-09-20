package com.realState.property_service.common.exceptions;

/**
 * Thrown when an owner does not have any properties.
 */
public class OwnerPropertyNotFoundException extends RuntimeException {
    public OwnerPropertyNotFoundException(String message) {
        super(message);
    }
}
