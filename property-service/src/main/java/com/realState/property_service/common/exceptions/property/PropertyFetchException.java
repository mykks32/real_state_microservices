package com.realState.property_service.common.exceptions.property;

/**
 * Exception thrown when a property retrieval operation fails.
 */
public class PropertyFetchException extends RuntimeException {

    public PropertyFetchException(String message) {
        super(message);
    }

    public PropertyFetchException(String message, Throwable cause) {
        super(message, cause);
    }
}