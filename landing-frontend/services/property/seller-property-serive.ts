import api from "@/lib/api";
import { IApiResponse } from "@/interfaces/common/IApiResponse";
import { IProperty } from "@/interfaces/property/property.interface";
import { BaseService } from "../common/base-service";
import { buildUrl } from "@/lib/url-builder";
import {CreatePropertyDTO} from "@/schemas/property/property-schema";

/** Service for seller-specific property actions */
export class SellerPropertyService extends BaseService {

    /** Create a new property */
    async createProperty(propertyData: CreatePropertyDTO): Promise<IApiResponse<IProperty> | null> {
        const url = buildUrl("/property");
        return this.handleRequest(
            api.post<IApiResponse<IProperty>>(url, propertyData),
            "Property created successfully",
            "Failed to create property"
        );
    }

    /** Get properties of the current seller */
    async getMyProperties(): Promise<IApiResponse<IProperty[]> | null> {
        const url = buildUrl("/property/owner");
        return this.handleRequest(
            api.get<IApiResponse<IProperty[]>>(url),
            undefined,
            "Failed to fetch my properties"
        );
    }

    /** Submit a property for approval */
    async submitForApproval(propertyId: string): Promise<IApiResponse<IProperty> | null> {
        const url = buildUrl(`/property/${propertyId}/submit`);
        return this.handleRequest(
            api.patch<IApiResponse<IProperty>>(url),
            "Property submitted for approval",
            `Failed to submit property ${propertyId} for approval`
        );
    }

    /** Update an existing property */
    async updateProperty(propertyId: string, propertyData: Partial<CreatePropertyDTO>): Promise<IApiResponse<IProperty> | null> {
        const url = buildUrl(`/property/${propertyId}`);
        return this.handleRequest(
            api.put<IApiResponse<IProperty>>(url, propertyData),
            "Property updated successfully",
            `Failed to update property ${propertyId}`
        );
    }
}

export default new SellerPropertyService();