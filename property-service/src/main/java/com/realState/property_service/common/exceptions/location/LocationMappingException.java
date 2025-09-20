package com.realState.property_service.common.exceptions.location;

public class LocationMappingException extends RuntimeException {
    public LocationMappingException(String msg) {
        super(msg);
    }

    public LocationMappingException(String msg, Throwable cause) {
        super(msg, cause);
    }
}