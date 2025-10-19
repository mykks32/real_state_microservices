import api from "@/lib/api";
import {ILoginRequest, IRegisterRequest} from "@/interfaces/auth/IAuthRequest";
import {ILoginResponse, IMeResponse, IRegisterResponse} from "@/interfaces/auth/IAuthResponse";
import {IApiResponse} from "@/interfaces/common/IApiResponse";

class AuthService {
    async login(credentials: ILoginRequest): Promise<ILoginResponse> {
        const response = await api.post<IApiResponse<ILoginResponse>>("/auth/login", credentials);
        // Access token is returned, refresh token is in HTTP-only cookie
        return response.data.data!;
    }

    async register(userData: IRegisterRequest): Promise<IRegisterResponse> {
        const response = await api.post<IApiResponse<IRegisterResponse>>("/auth/register", userData);
        return response.data.data!;
    }

    async me(): Promise<IMeResponse> {
        const response = await api.get<IApiResponse<IMeResponse>>("/auth/me");
        return response.data.data!;
    }

    async logout(): Promise<void> {
        await api.post("/auth/logout"); // backend clears cookie
    }
}

export default new AuthService();