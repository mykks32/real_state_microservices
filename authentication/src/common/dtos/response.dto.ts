export class ApiResponse<T> {
  success: boolean;
  errorName?: string;
  message: string;
  statusCode: number;
  data?: T;
  timestamp: string;
  requestId?: string;

  constructor(partial: Partial<ApiResponse<T>>) {
    Object.assign(this, partial);
  }

  static ok<T>(
    data: T,
    message = 'success',
    statusCode = 200,
    requestId?: string,
  ) {
    return new ApiResponse<T>({
      success: true,
      statusCode,
      message,
      data,
      requestId,
      timestamp: new Date().toISOString(),
    });
  }

  static error(
    errorName?: string,
    message = 'Error',
    statusCode = 500,
    requestId?: string,
  ) {
    return new ApiResponse<null>({
      success: false,
      errorName,
      statusCode,
      message,
      requestId,
      timestamp: new Date().toISOString(),
    });
  }
}
