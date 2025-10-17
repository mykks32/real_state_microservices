package com.realState.property_service.module.property.controller;

import com.realState.property_service.common.utils.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

/**
 * Public controller for utility endpoints.
 * <p>
 * Provides:
 * - Health check
 * - HTML welcome page
 * - Swagger documentation
 */
@RestController
@Tag(name = "Public APIs", description = "Utility endpoints for service status and documentation")
public class HealthController {

    /**
     * Health check endpoint.
     *
     * @return JSON response confirming service is working
     */
    @Operation(
            summary = "Health check",
            description = "Verifies that the service is up and running"
    )
    @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "200",
            description = "Service is healthy"
    )
    @GetMapping("/health")
    public ResponseEntity<ApiResponse<Map<String, String>>> health() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "working");
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    /**
     * Root endpoint serving a simple HTML welcome page.
     *
     * @return HTML content
     */
    @Operation(
            summary = "Welcome page",
            description = "Displays a simple HTML landing page with links to Swagger documentation"
    )
    @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "200",
            description = "HTML welcome page"
    )
    @GetMapping(value = "/", produces = MediaType.TEXT_HTML_VALUE)
    public String welcome() {
        return """
            <!DOCTYPE html>
            <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>RealState Property Service</title>
                    <style>
                        body { font-family: system-ui, sans-serif; background: #f5f6fa; color: #2f3640; text-align: center; padding: 60px; }
                        h1 { color: #40739e; }
                        a { text-decoration: none; color: #0097e6; font-weight: bold; }
                        a:hover { text-decoration: underline; }
                    </style>
                </head>
                <body>
                    <h1>🏠 RealState Property Service</h1>
                    <p>Welcome! Access documentation here: <a href="/docs">Swagger UI</a> | <a href="/docs/api-docs">OpenAPI JSON</a></p>
                </body>
            </html>
            """;
    }
}