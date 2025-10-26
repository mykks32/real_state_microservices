import api from "@/lib/api";
import {IApiResponse} from "@/interfaces/common/IApiResponse";
import {IProperty} from "@/interfaces/property/property.interface";
import {BaseService} from "../common/base-service";
import {buildUrl} from "@/lib/url-builder";
import {CreatePropertyDTO} from "@/schemas/property/property-schema";

export class AdminPropertyService extends BaseService {

    async approveProperty(propertyId: string): Promise<IApiResponse<IProperty> | null> {
        const url = buildUrl(`/property/${propertyId}/approve`);
        return this.handleRequest(
            api.patch<IApiResponse<IProperty>>(url),
            "Property approved successfully",
            `Failed to approve property ${propertyId}`
        );
    }

    async rejectProperty(propertyId: string): Promise<IApiResponse<IProperty> | null> {
        const url = buildUrl(`/property/${propertyId}/reject`);
        return this.handleRequest(
            api.patch<IApiResponse<IProperty>>(url),
            "Property rejected successfully",
            `Failed to reject property ${propertyId}`
        );
    }

    async archiveProperty(propertyId: string): Promise<IApiResponse<IProperty> | null> {
        const url = buildUrl(`/property/${propertyId}/archive`);
        return this.handleRequest(
            api.patch<IApiResponse<IProperty>>(url),
            "Property archived successfully",
            `Failed to archive property ${propertyId}`
        );
    }

    async deleteProperty(propertyId: string): Promise<IApiResponse<null> | null> {
        const url = buildUrl(`/property/delete/${propertyId}`);
        return this.handleRequest(
            api.delete<IApiResponse<null>>(url),
            "Property deleted successfully",
            `Failed to delete property ${propertyId}`
        );
    }

    async getPendingProperties(page = 1, pageSize = 10): Promise<IApiResponse<IProperty[]> | null> {
        const url = buildUrl("/property/pending", { page, size: pageSize });
        return this.handleRequest(
            api.get<IApiResponse<IProperty[]>>(url),
            undefined,
            "Failed to fetch pending properties"
        );
    }

    async getAllProperties(page = 1, pageSize = 10): Promise<IApiResponse<IProperty[]> | null> {
        const url = buildUrl("/property/all", { page, size: pageSize });
        return this.handleRequest(
            api.get<IApiResponse<IProperty[]>>(url),
            undefined,
            "Failed to fetch all properties"
        );
    }
    /** Create a new property */
    async createApprovedProperty(propertyData: CreatePropertyDTO): Promise<IApiResponse<IProperty> | null> {
        const url = buildUrl("/property/admin/create");
        return this.handleRequest(
            api.post<IApiResponse<IProperty>>(url, propertyData),
            "Property created successfully",
            "Failed to create property"
        );
    }
}

export default new AdminPropertyService();