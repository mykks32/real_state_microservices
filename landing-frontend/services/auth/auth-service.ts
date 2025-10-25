import api from "@/lib/api";
import { toast } from "sonner";
import { ILoginRequest, IRegisterRequest } from "@/interfaces/auth/IAuthRequest";
import { ILoginResponse, IMeResponse, IRegisterResponse } from "@/interfaces/auth/IAuthResponse";
import { IApiResponse } from "@/interfaces/common/IApiResponse";
import { BaseService } from "@/services/common/base-service";
import {RegisterUserType} from "@/schemas/auth/register-user";

export class AuthService extends BaseService {

    async login(credentials: ILoginRequest): Promise<IApiResponse<ILoginResponse> | null> {
        return this.handleRequest(
            api.post<IApiResponse<ILoginResponse>>("/auth/login", credentials),
            "Login successful",
            "Login failed. Please check your credentials."
        );
    }

    async register(userData: RegisterUserType): Promise<IApiResponse<IRegisterResponse> | null> {
        return this.handleRequest(
            api.post<IApiResponse<IRegisterResponse>>("/auth/register", userData),
            "Registration successful",
            "Registration failed. Please try again."
        );
    }

    async me(): Promise<IApiResponse<IMeResponse> | null> {
        return this.handleRequest(
            api.get<IApiResponse<IMeResponse>>("/auth/me"),
            undefined,
            "Failed to fetch user data."
        );
    }

    async logout(): Promise<void> {
        try {
            await api.post("/auth/logout");
            toast.success("Logged out successfully");
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Logout failed";
            toast.error(message);
            console.error("Logout error:", message);
        }
    }
}

export default new AuthService();