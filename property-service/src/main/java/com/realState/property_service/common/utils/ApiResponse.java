package com.realState.property_service.common.utils;

import java.time.LocalDateTime;

/**
 * Standard API response wrapper for REST endpoints.
 * <p>
 * Provides a consistent response structure for both successful and error responses.
 *
 * @param <T> Type of the response data
 */
public class ApiResponse<T> {

    /** Indicates whether the request was successful */
    private boolean success;

    /** Error code or name for failures; null for success */
    private String errorCode;

    /** Human-readable message */
    private String message;

    /** HTTP status code */
    private int status;

    /** Response payload; null for errors */
    private T data;

    /** Timestamp of the response */
    private LocalDateTime timestamp;

    /**
     * Default constructor initializes timestamp.
     */
    public ApiResponse() {
        this.timestamp = LocalDateTime.now();
    }

    /**
     * All-args constructor.
     *
     * @param success  success flag
     * @param errorCode error code or null if success
     * @param message  descriptive message
     * @param status   HTTP status code
     * @param data     response payload or null if error
     */
    public ApiResponse(boolean success, String errorCode, String message, int status, T data) {
        this.success = success;
        this.errorCode = errorCode;
        this.message = message;
        this.status = status;
        this.data = data;
        this.timestamp = LocalDateTime.now();
    }

    // ===== Getters and Setters =====

    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }

    public String getErrorCode() { return errorCode; }
    public void setErrorCode(String errorCode) { this.errorCode = errorCode; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public int getStatus() { return status; }
    public void setStatus(int status) { this.status = status; }

    public T getData() { return data; }
    public void setData(T data) { this.data = data; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }

    // ===== Static Factory Methods =====

    /**
     * Builds a successful response with default message.
     *
     * @param data response payload
     * @param <T> type of the payload
     * @return ApiResponse instance
     */
    public static <T> ApiResponse<T> success(T data) {
        return new ApiResponse<>(true, null, "Request processed successfully", 200, data);
    }

    /**
     * Builds a successful response with custom message.
     *
     * @param data response payload
     * @param message custom success message
     * @param <T> type of the payload
     * @return ApiResponse instance
     */
    public static <T> ApiResponse<T> success(T data, String message) {
        return new ApiResponse<>(true, null, message, 200, data);
    }

    /**
     * Builds an error response with custom error code, message, and HTTP status.
     *
     * @param errorCode application-specific error code
     * @param message descriptive error message
     * @param status HTTP status code
     * @param <T> type of data (null for errors)
     * @return ApiResponse instance
     */
    public static <T> ApiResponse<T> error(String errorCode, String message, int status) {
        return new ApiResponse<>(false, errorCode, message, status, null);
    }

    /**
     * Builds an error response with default HTTP status 500.
     *
     * @param errorCode application-specific error code
     * @param message descriptive error message
     * @param <T> type of data (null for errors)
     * @return ApiResponse instance
     */
    public static <T> ApiResponse<T> error(String errorCode, String message) {
        return new ApiResponse<>(false, errorCode, message, 500, null);
    }
}