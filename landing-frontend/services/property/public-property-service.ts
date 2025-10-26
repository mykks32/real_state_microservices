import {IApiResponse} from "@/interfaces/common/IApiResponse";
import {IProperty} from "@/interfaces/property/property.interface";
import {IFilter} from "@/interfaces/common/IFilter";
import {buildUrl} from "@/lib/url-builder";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

/** Service for public property API requests */
export class PublicPropertyService {

    /** Get properties by filters */
    async filterProperties(filters: IFilter): Promise<IApiResponse<IProperty[]> | null> {
        const relativeUrl = buildUrl("/property/filter", {
            status: filters.status,
            type: filters.type,
            state: filters.state,
            page: filters.page,
            size: filters.size,
        });
        const url = new URL(relativeUrl, BASE_URL).toString();

        return this.handleRequest<IProperty[]>(url);
    }

    /** Get a property by ID */
    async getPropertyById(propertyId: string): Promise<IApiResponse<IProperty> | null> {
        const relativeUrl = buildUrl(`/property/id/${propertyId}`);
        const url = new URL(relativeUrl, BASE_URL).toString();

        return this.handleRequest<IProperty>(url);
    }

    /** Get approved properties with pagination */
    async getApprovedProperties(page = 1, pageSize = 10): Promise<IApiResponse<IProperty[]> | null> {
        const relativeUrl = buildUrl("/property/approved", { page, size: pageSize });
        const url = new URL(relativeUrl, BASE_URL).toString();

        return this.handleRequest<IProperty[]>(url);
    }

    /** Centralized request handler using fetch */
    private async handleRequest<T>(url: string, errorMessage = "API request failed"): Promise<IApiResponse<T> | null> {
        try {
            const response = await fetch(url, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });

            if (!response.ok) {
                if (response.status === 404) {
                    console.error(`Resource not found: ${url}`);
                } else {
                    const data = await response.json().catch(() => null);
                    console.error(`API Error: ${response.statusText}`, {
                        status: response.status,
                        data,
                    });
                }
                return null;
            }

            return await response.json();
        } catch (error) {
            if (error instanceof Error) {
                console.error(`Error: ${error.name} - ${error.message}`);
            } else {
                console.error(errorMessage);
            }
            return null;
        }
    }
}

export default new PublicPropertyService();