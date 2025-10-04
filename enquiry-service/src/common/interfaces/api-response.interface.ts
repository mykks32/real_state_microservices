export interface IApiResponse<T> {
  success: boolean;
  errorName?: string;
  message: string;
  statusCode: number;
  data?: T;
  timestamp: string;
  requestId?: string;
}
