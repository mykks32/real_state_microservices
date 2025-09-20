package com.realState.property_service.common.exceptions;

/**
 * Thrown when mapping between DTO and entity fails.
 */
public class PropertyMappingException extends RuntimeException {
    public PropertyMappingException(String message) {
        super(message);
    }

    public PropertyMappingException(String message, Throwable cause) {
        super(message, cause);
    }
}