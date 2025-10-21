package com.realState.property_service.common.utils;

import java.time.LocalDateTime;

/**
 * Standard API response wrapper for REST endpoints.
 * <p>
 * Provides a consistent structure for both successful and error responses.
 * Supports optional pagination metadata for endpoints returning paginated data.
 *
 * @param <T> Type of the response payload
 */
public class ApiResponse<T> {

    /** Indicates if the request was successful */
    private boolean success;

    /** Application-specific error code; null if request is successful */
    private String errorCode;

    /** Human-readable message describing the response */
    private String message;

    /** HTTP status code */
    private int status;

    /** Response payload; null if there is an error */
    private T data;

    /** Timestamp of the response creation */
    private LocalDateTime timestamp;

    /** Optional pagination metadata */
    private MetaData meta;

    // ===== Inner MetaData Class =====

    /**
     * Represents pagination information for API responses.
     */
    public static class MetaData {
        /** Total number of items in the dataset */
        private long totalItems;

        /** Total number of pages */
        private int totalPages;

        /** Current page index (0-based) */
        private int currentPage;

        /** Number of items per page */
        private int pageSize;

        /** Default constructor */
        public MetaData() {}

        /**
         * Constructor with full pagination details.
         *
         * @param totalItems  Total number of items
         * @param totalPages  Total number of pages
         * @param currentPage Current page index (0-based)
         * @param pageSize    Items per page
         */
        public MetaData(long totalItems, int totalPages, int currentPage, int pageSize) {
            this.totalItems = totalItems;
            this.totalPages = totalPages;
            this.currentPage = currentPage;
            this.pageSize = pageSize;
        }

        // ===== Getters and Setters =====
        public long getTotalItems() { return totalItems; }
        public void setTotalItems(long totalItems) { this.totalItems = totalItems; }

        public int getTotalPages() { return totalPages; }
        public void setTotalPages(int totalPages) { this.totalPages = totalPages; }

        public int getCurrentPage() { return currentPage; }
        public void setCurrentPage(int currentPage) { this.currentPage = currentPage; }

        public int getPageSize() { return pageSize; }
        public void setPageSize(int pageSize) { this.pageSize = pageSize; }
    }

    // ===== Constructors =====

    /** Default constructor initializes timestamp */
    public ApiResponse() {
        this.timestamp = LocalDateTime.now();
    }

    /**
     * Constructor without metadata.
     *
     * @param success   Success flag
     * @param errorCode Error code or null
     * @param message   Descriptive message
     * @param status    HTTP status code
     * @param data      Response payload or null
     */
    public ApiResponse(boolean success, String errorCode, String message, int status, T data) {
        this.success = success;
        this.errorCode = errorCode;
        this.message = message;
        this.status = status;
        this.data = data;
        this.timestamp = LocalDateTime.now();
    }

    /**
     * Constructor with metadata.
     *
     * @param success   Success flag
     * @param errorCode Error code or null
     * @param message   Descriptive message
     * @param status    HTTP status code
     * @param data      Response payload or null
     * @param meta      Optional pagination metadata
     */
    public ApiResponse(boolean success, String errorCode, String message, int status, T data, MetaData meta) {
        this.success = success;
        this.errorCode = errorCode;
        this.message = message;
        this.status = status;
        this.data = data;
        this.meta = meta;
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

    public MetaData getMeta() { return meta; }
    public void setMeta(MetaData meta) { this.meta = meta; }

    // ===== Static Factory Methods =====

    /**
     * Builds a successful response without metadata.
     *
     * @param data Response payload
     * @param <T>  Type of payload
     * @return ApiResponse instance
     */
    public static <T> ApiResponse<T> success(T data) {
        return new ApiResponse<>(true, null, "Request processed successfully", 200, data);
    }

    /**
     * Builds a successful response with custom message.
     *
     * @param data    Response payload
     * @param message Custom success message
     * @param <T>     Type of payload
     * @return ApiResponse instance
     */
    public static <T> ApiResponse<T> success(T data, String message) {
        return new ApiResponse<>(true, null, message, 200, data);
    }

    /**
     * Builds a successful paginated response with metadata.
     *
     * @param data    Response payload
     * @param meta    Pagination metadata
     * @param message Custom success message
     * @param <T>     Type of payload
     * @return ApiResponse instance
     */
    public static <T> ApiResponse<T> success(T data, MetaData meta, String message) {
        return new ApiResponse<>(true, null, message, 200, data, meta);
    }

    /**
     * Builds an error response with custom HTTP status.
     *
     * @param errorCode Error code
     * @param message   Error message
     * @param status    HTTP status code
     * @param <T>       Type of data (null for errors)
     * @return ApiResponse instance
     */
    public static <T> ApiResponse<T> error(String errorCode, String message, int status) {
        return new ApiResponse<>(false, errorCode, message, status, null);
    }

    /**
     * Builds an error response with default HTTP status 500.
     *
     * @param errorCode Error code
     * @param message   Error message
     * @param <T>       Type of data (null for errors)
     * @return ApiResponse instance
     */
    public static <T> ApiResponse<T> error(String errorCode, String message) {
        return new ApiResponse<>(false, errorCode, message, 500, null);
    }
}