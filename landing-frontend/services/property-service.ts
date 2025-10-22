import api from "@/lib/api";
import {IApiResponse} from "@/interfaces/common/IApiResponse";
import {IProperty} from "@/interfaces/property/property.interface";

class PropertyService {
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
}

export default new PropertyService();