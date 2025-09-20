package com.realState.property_service.common.utils;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ApiResponse<T> {
    private T data;
    private boolean success;
    private String error;
    private String code;
    private LocalDateTime timestamp;

    private ApiResponse(T data, boolean success, String error, String code) {
        this.data = data;
        this.success = success;
        this.error = error;
        this.code = code;
        this.timestamp = LocalDateTime.now();
    }

    public static <T> ApiResponse<T> success(T data) {
        return new ApiResponse<>(data, true, null, "OK");
    }

    public static <T> ApiResponse<T> error(String error, String code) {
        return new ApiResponse<>(null, false, error, code);
    }
}