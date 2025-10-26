import api from "@/lib/api";
import { toast } from "sonner";
import { ILoginRequest } from "@/interfaces/auth/IAuthRequest";
import { ILoginResponse, IMeResponse, IRegisterResponse } from "@/interfaces/auth/IAuthResponse";
import { IApiResponse } from "@/interfaces/common/IApiResponse";
import { BaseService } from "@/services/common/base-service";
import {RegisterUserType} from "@/schemas/auth/register-user";
import {buildUrl} from "@/lib/url-builder";

export class AuthService extends BaseService {

    async login(credentials: ILoginRequest): Promise<IApiResponse<ILoginResponse> | null> {
        const url = buildUrl("/auth/login")
        return this.handleRequest(
            api.post<IApiResponse<ILoginResponse>>(url, credentials),
            "Login successful",
            "Login failed. Please check your credentials."
        );
    }

    async register(userData: RegisterUserType): Promise<IApiResponse<IRegisterResponse> | null> {
        const url = buildUrl("/auth/register");
        return this.handleRequest(
            api.post<IApiResponse<IRegisterResponse>>(url, userData),
            "Registration successful",
            "Registration failed. Please try again."
        );
    }

    async me(): Promise<IApiResponse<IMeResponse> | null> {
        const url = buildUrl("/auth/me");
        try {
            const response = await api.get(url);
            return response.data;
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "User Not Found";
            console.warn("User Detail Fetch error:", message);
            return null;
        }
    }

    async logout(): Promise<void> {
        const url = buildUrl("/auth/logout");
        try {
            await api.post(url);
            toast.success("Logged out successfully");
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Logout failed";
            toast.error(message);
            console.error("Logout error:", message);
        }
    }
}

export default new AuthService();