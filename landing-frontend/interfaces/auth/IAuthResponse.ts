import { IUser } from "./IUser";

export interface ILoginResponse {
    user: Omit<IUser, 'password'>
    accessToken: string;
    refreshToken: string;
}

export interface IRegisterResponse {
    user: Omit<IUser, 'password'>;
}

export interface IMeResponse {
    user: Omit<IUser, 'password'>;
    accessToken: string | null;
}