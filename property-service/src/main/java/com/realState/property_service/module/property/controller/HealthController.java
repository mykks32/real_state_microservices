package com.realState.property_service.module.property.controller;

import com.realState.property_service.common.utils.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

/**
 * REST controller for health check endpoint.
 */
@RestController
public class HealthController {

    /**
     * Health check endpoint.
     */
    @Operation(
            summary = "Health check endpoint",
            description = "Health check endpoint to verify service status",
            tags = { "Utility APIs" }
    )
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "Service is healthy and running"
            )
    })
    @GetMapping("/health")
    public ResponseEntity<ApiResponse<Map<String, String>>> health() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "working");
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}