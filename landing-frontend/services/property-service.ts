import api from "@/lib/api";
import {IApiResponse} from "@/interfaces/common/IApiResponse";
import {IProperty} from "@/interfaces/property/property.interface";

class PropertyService {
    async approvedProperty() {
        try {
            const response = await api.get<IApiResponse<IProperty[]>>(
                "/property/approved"
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