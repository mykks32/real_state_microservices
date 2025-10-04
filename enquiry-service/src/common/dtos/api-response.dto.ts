import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IApiResponse } from '../interfaces/api-response.interface';

export class ApiResponse<T> implements IApiResponse<T> {
  @ApiProperty()
  success: boolean;

  @ApiPropertyOptional({ example: undefined })
  errorName?: string;

  @ApiProperty()
  message: string;

  @ApiProperty()
  statusCode: number;

  @ApiPropertyOptional({ type: Object, example: undefined })
  data?: T;

  @ApiProperty()
  timestamp: string;

  @ApiPropertyOptional({ example: undefined })
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
