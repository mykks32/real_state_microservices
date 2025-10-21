import api from "@/lib/api";
import {IApiResponse} from "@/interfaces/common/IApiResponse";
import {IProperty} from "@/interfaces/property/property.interface";

class PropertyService {
    async approvedProperty(
        page: number = 1,
        pageSize: number = 10,) {
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
        }
    }
}

export default new PropertyService();