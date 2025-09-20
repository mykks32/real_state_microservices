package com.realState.property_service.common.handler;

import com.realState.property_service.common.exceptions.DuplicateResourceException;
import com.realState.property_service.common.exceptions.LocationCreationException;
import com.realState.property_service.common.exceptions.OwnerPropertyNotFoundException;
import com.realState.property_service.common.exceptions.PropertyMappingException;
import com.realState.property_service.common.exceptions.PropertyNotFoundException;
import com.realState.property_service.common.exceptions.PropertySaveException;
import com.realState.property_service.common.utils.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

/**
 * Global exception handler for Property Service.
 * Handles all custom exceptions, runtime exceptions, and unexpected errors.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {
    /**
     * Helper method to build consistent ApiResponse for any exception.
     */
    private ResponseEntity<ApiResponse<Object>> buildResponse(String errorName, String message, HttpStatus status) {
        ApiResponse<Object> response = ApiResponse.error(errorName, message, status.value());
        return new ResponseEntity<>(response, status);
    }

    @ExceptionHandler(PropertyNotFoundException.class)
    public ResponseEntity<ApiResponse<Object>> handlePropertyNotFound(PropertyNotFoundException ex) {
        return buildResponse("PROPERTY_NOT_FOUND", ex.getMessage(), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(OwnerPropertyNotFoundException.class)
    public ResponseEntity<ApiResponse<Object>> handleOwnerPropertyNotFound(OwnerPropertyNotFoundException ex) {
        return buildResponse("OWNER_PROPERTY_NOT_FOUND", ex.getMessage(), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(LocationCreationException.class)
    public ResponseEntity<ApiResponse<Object>> handleLocationCreation(LocationCreationException ex) {
        return buildResponse("LOCATION_CREATION_FAILED", ex.getMessage(), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(PropertyMappingException.class)
    public ResponseEntity<ApiResponse<Object>> handlePropertyMapping(PropertyMappingException ex) {
        return buildResponse("PROPERTY_MAPPING_FAILED", ex.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(PropertySaveException.class)
    public ResponseEntity<ApiResponse<Object>> handlePropertySave(PropertySaveException ex) {
        return buildResponse("PROPERTY_SAVE_FAILED", ex.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(DuplicateResourceException.class)
    public ResponseEntity<ApiResponse<Object>> handleDuplicateResource(DuplicateResourceException ex) {
        return buildResponse("DUPLICATE_RESOURCE", ex.getMessage(), HttpStatus.CONFLICT);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiResponse<Object>> handleIllegalArgument(IllegalArgumentException ex) {
        return buildResponse("INVALID_ARGUMENT", ex.getMessage(), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ApiResponse<Object>> handleRuntimeException(RuntimeException ex) {
        return buildResponse("RUNTIME_EXCEPTION", ex.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Object>> handleAllOtherExceptions(Exception ex, WebRequest request) {
        return buildResponse(ex.getClass().getSimpleName(),
                ex.getMessage() != null ? ex.getMessage() : "Internal server error",
                HttpStatus.INTERNAL_SERVER_ERROR);
    }
}