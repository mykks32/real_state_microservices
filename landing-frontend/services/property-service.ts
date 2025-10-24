import api from "@/lib/api";
import {IApiResponse} from "@/interfaces/common/IApiResponse";
import {IProperty} from "@/interfaces/property/property.interface";
import {IFilter} from "@/interfaces/common/IFilter";

class PropertyService {
    async filterProperties(filters: IFilter): Promise<IApiResponse<IProperty[]> | null> {
        try {
            const params = new URLSearchParams();

            // Add optional filters only if they have values
            if (filters.status) {
                params.append("status", filters.status);
            }
            if (filters.type) {
                params.append("type", filters.type);
            }
            if (filters.state) {
                params.append("state", filters.state);
            }

            params.append("page", filters.page.toString());
            params.append("size", filters.size.toString());

            const response = await api.get<IApiResponse<IProperty[]>>(
                `/property/filter?${params.toString()}`
            );
            return response.data;
        } catch (error) {
            console.error(
                error instanceof Error ? error.message : "Login failed. Please check your credentials."
            );
            return null
        }
    }

    async approvedProperty(
        page: number = 1,
        pageSize: number = 10,): Promise<IApiResponse<IProperty[]> | null> {
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                size: pageSize.toString(),
            });
            const response = await api.get<IApiResponse<IProperty[]>>(
                `/property/approved?${params.toString()}`
            );
            return response.data;
        } catch (error) {
            console.error(
                error instanceof Error ? error.message : "Login failed. Please check your credentials."
            );
            return null
        }
    }

    async getPropertyById(propertyId: string): Promise<IApiResponse<IProperty> | null> {
        try {
            const response = await api.get<IApiResponse<IProperty>>(`/property/id/${propertyId}`);

            if (!response.data.success) {
                return null;
            }
            return response.data;
        } catch (error) {
            console.error(
                error instanceof Error ? error.message : "No property found for the given id"
            )
            return null
        }
    }

    // Admin
    // Pending a property
    async getPendingProperty(
        page: number = 1,
        pageSize: number = 10,): Promise<IApiResponse<IProperty[]> | null> {
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                size: pageSize.toString(),
            });
            const response = await api.get<IApiResponse<IProperty[]>>(
                `/property/pending?${params.toString()}`
            );
            return response.data;
        } catch (error) {
            console.error(
                error instanceof Error ? error.message : "Login failed. Please check your credentials."
            );
            return null
        }
    }
    // Approve a property
    async getAllProperty(
        page: number = 1,
        pageSize: number = 10,): Promise<IApiResponse<IProperty[]> | null> {
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                size: pageSize.toString(),
            });
            const response = await api.get<IApiResponse<IProperty[]>>(
                `/property/all?${params.toString()}`
            );
            return response.data;
        } catch (error) {
            console.error(
                error instanceof Error ? error.message : "Login failed. Please check your credentials."
            );
            return null
        }
    }

    async approveProperty(propertyId: string): Promise<IApiResponse<IProperty> | null> {
        try {
            const response = await api.patch<IApiResponse<IProperty>>(
                `/property/${propertyId}/approve`
            );
            return response.data;
        } catch (error) {
            console.error(
                error instanceof Error ? error.message : "Failed to approve property."
            );
            return null;
        }
    }

    // Reject a property
    async rejectProperty(propertyId: string): Promise<IApiResponse<IProperty> | null> {
        try {
            const response = await api.patch<IApiResponse<IProperty>>(
                `/property/${propertyId}/reject`
            );
            return response.data;
        } catch (error) {
            console.error(
                error instanceof Error ? error.message : "Failed to reject property."
            );
            return null;
        }
    }

    // Archive a property
    async archiveProperty(propertyId: string): Promise<IApiResponse<IProperty> | null> {
        try {
            const response = await api.patch<IApiResponse<IProperty>>(
                `/property/${propertyId}/archive`
            );
            return response.data;
        } catch (error) {
            console.error(
                error instanceof Error ? error.message : "Failed to archive property."
            );
            return null;
        }
    }

    // Delete a property
    async deleteProperty(propertyId: string): Promise<IApiResponse<null> | null> {
        try {
            const response = await api.delete<IApiResponse<null>>(
                `/property/delete/${propertyId}`
            );
            return response.data;
        } catch (error) {
            console.error(
                error instanceof Error ? error.message : "Failed to delete property."
            );
            return null;
        }
    }
}

export default new PropertyService();