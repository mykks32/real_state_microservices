import api from "@/lib/api";
import {ILoginRequest, IRegisterRequest} from "@/interfaces/auth/IAuthRequest";
import {ILoginResponse, IMeResponse, IRegisterResponse} from "@/interfaces/auth/IAuthResponse";
import {IApiResponse} from "@/interfaces/common/IApiResponse";

class AuthService {
    async login(credentials: ILoginRequest): Promise<ILoginResponse> {
        try {
            const response = await api.post<IApiResponse<ILoginResponse>>(
                "/auth/login",
                credentials
            );
            return response.data.data!;
        } catch (error) {
            throw new Error(
                error instanceof Error ? error.message : "Login failed. Please check your credentials."
            );
        }
    }

    async register(userData: IRegisterRequest): Promise<IRegisterResponse> {
        try {
            const response = await api.post<IApiResponse<IRegisterResponse>>(
                "/auth/register",
                userData
            );
            return response.data.data!;
        } catch (error) {
            throw new Error(
                error instanceof Error ? error.message : "Registration failed. Please try again."
            );
        }
    }

    async me(): Promise<IMeResponse> {
        try {
            const response = await api.get<IApiResponse<IMeResponse>>(
                "/auth/me"
            );
            return response.data.data!;
        } catch (error) {
            throw new Error(
                error instanceof Error ? error.message : "Failed to fetch user data."
            );
        }
    }

    async logout(): Promise<void> {
        try {
            await api.post("/auth/logout");
        } catch (error) {
            console.error("Logout error:", error);
            // Don't throw on logout failure - still clear local state
        }
    }
}

export default new AuthService();