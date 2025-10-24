import { toast } from "sonner";
import { AxiosError } from "axios";

/**
 * BaseService handles:
 * - API requests
 * - Success & error toasts
 * - Standardized console logging
 */
export class BaseService {
    protected async handleRequest<T>(
        request: Promise<{ data: T }>,
        successMessage?: string,
        fallbackMessage?: string
    ): Promise<T | null> {
        try {
            const response = await request;

            if (successMessage) toast.success(successMessage);

            return response.data;
        } catch (error: unknown) {
            // Determine message
            const message =
                error instanceof Error
                    ? error.message
                    : error instanceof AxiosError
                        ? error.response?.data?.message || fallbackMessage || "Something went wrong"
                        : fallbackMessage || "Something went wrong";

            // Show toast
            toast.error(message, {
                style: { backgroundColor: "red", color: "white" } // red-300
            });
            // Single-line console log with all important info
            console.error(
                `[BaseService Error] name: ${
                    error instanceof Error ? error.name : "Unknown"
                }, message: ${message}, status: ${
                    error instanceof AxiosError ? error.response?.status : "N/A"
                }, stack: ${error instanceof Error ? error.stack : "N/A"}, response: ${
                    error instanceof AxiosError ? JSON.stringify(error.response?.data) : "N/A"
                }`
            );

            return null;
        }
    }
}