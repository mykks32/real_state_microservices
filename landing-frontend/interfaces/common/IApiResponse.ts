/**
 * Generic API response interface
 */
export interface IApiResponse<T = any> {
    success: boolean;
    errorName?: string;
    message: string;
    statusCode: number;
    data?: T;
    meta?: {
        totalItems: number;
        totalPages: number;
        currentPage: number;
        pageSize: number;
    };
    timestamp: string;
    requestId?: string;
}