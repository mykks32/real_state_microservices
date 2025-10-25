import { IApiResponse } from "@/interfaces/common/IApiResponse";
import { IProperty } from "@/interfaces/property/property.interface";
import { IFilter } from "@/interfaces/common/IFilter";
import { buildUrl } from "@/lib/url-builder";
import axios, { AxiosError, AxiosRequestConfig } from "axios";

/** Service for public property API requests */
export class PublicPropertyService {

    /** Get properties by filters */
    async filterProperties(filters: IFilter): Promise<IApiResponse<IProperty[]> | null> {
        const url = buildUrl("/property/filter", {
            status: filters.status,
            type: filters.type,
            state: filters.state,
            page: filters.page,
            size: filters.size,
        });

        return this.handleRequest<IProperty[]>({
            method: "GET",
            url,
            headers: { 'Content-Type': 'application/json' },
        }, "Failed to filter properties");
    }

    /** Get a property by ID */
    async getPropertyById(propertyId: string): Promise<IApiResponse<IProperty> | null> {
        const url = buildUrl(`/property/id/${propertyId}`);

        return this.handleRequest<IProperty>({
            method: "GET",
            url,
            headers: { 'Content-Type': 'application/json' },
        }, `Failed to fetch property: ${propertyId}`);
    }

    /** Get approved properties with pagination */
    async getApprovedProperties(page = 1, pageSize = 10): Promise<IApiResponse<IProperty[]> | null> {
        const url = buildUrl("/property/approved", { page, size: pageSize });

        return this.handleRequest<IProperty[]>({
            method: "GET",
            url,
            headers: { 'Content-Type': 'application/json' },
        }, "Failed to fetch approved properties");
    }

    /** Centralized request handler */
    private async handleRequest<T>(config: AxiosRequestConfig, errorMessage = "API request failed"): Promise<IApiResponse<T> | null> {
        try {
            const response = await axios(config);
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                if (error.response?.status === 404) {
                    console.error(`Resource not found: ${config.url}`);
                } else {
                    console.error(`API Error: ${error.message}`, {
                        status: error.response?.status,
                        data: error.response?.data,
                    });
                }
            } else if (error instanceof Error) {
                console.error(`Error: ${error.name} - ${error.message}`);
            } else {
                console.error(errorMessage);
            }
            return null;
        }
    }
}

export default new PublicPropertyService();