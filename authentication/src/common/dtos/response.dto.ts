import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Generic API response DTO compatible with ShadCN Table.
 * Includes support for success, error, and paginated responses.
 *
 * @template T - Type of the items in the response data array
 */
export class ApiResponse<T> {
  /**
   * Indicates whether the request was successful
   */
  @ApiProperty({ description: 'Indicates if the request was successful' })
  success: boolean;

  /**
   * Optional error name/code for failed requests
   */
  @ApiPropertyOptional({ description: 'Optional error name/code' })
  errorName?: string;

  /**
   * Response message describing the result
   */
  @ApiProperty({ description: 'Response message' })
  message: string;

  /**
   * HTTP status code of the response
   */
  @ApiProperty({ description: 'HTTP status code' })
  statusCode: number;

  /**
   * Array of items for the current response.
   * Compatible with ShadCN Table where `data` is the table rows.
   */
  @ApiPropertyOptional({
    description: 'Array of data items',
    type: Object,
    isArray: true,
  })
  data?: T;

  /**
   * Optional pagination metadata for paginated responses.
   */
  @ApiPropertyOptional({
    description: 'Pagination metadata for table',
    example: {
      totalItems: 100,
      totalPages: 10,
      currentPage: 1,
      pageSize: 10,
    },
  })
  meta?: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
  };

  /**
   * ISO timestamp when the response was generated
   */
  @ApiProperty({ description: 'ISO timestamp of the response' })
  timestamp: string;

  /**
   * Optional request identifier for tracing requests
   */
  @ApiPropertyOptional({
    description: 'Optional request identifier for tracing',
  })
  requestId?: string;

  /**
   * Constructor to assign partial fields to the ApiResponse object
   * @param partial Partial<ApiResponse<T>>
   */
  constructor(partial: Partial<ApiResponse<T>>) {
    Object.assign(this, partial);
  }

  /**
   * Create a generic success response
   * @param data Array of response items
   * @param message Success message (default: 'Success')
   * @param statusCode HTTP status code (default: 200)
   * @param requestId Optional request ID
   * @returns ApiResponse<T[]> instance
   */
  static ok<T>(
    data: T,
    message = 'Success',
    statusCode = 200,
    requestId?: string,
  ): ApiResponse<T> {
    return new ApiResponse<T>({
      success: true,
      statusCode,
      message,
      data,
      timestamp: new Date().toISOString(),
      requestId,
    });
  }

  /**
   * Create a generic error response
   * @param errorName Optional error code/name
   * @param message Error message (default: 'Error')
   * @param statusCode HTTP status code (default: 500)
   * @param requestId Optional request ID
   * @returns ApiResponse<null> instance
   */
  static error(
    errorName?: string,
    message = 'Error',
    statusCode = 500,
    requestId?: string,
  ): ApiResponse<null> {
    return new ApiResponse<null>({
      success: false,
      errorName,
      statusCode,
      message,
      timestamp: new Date().toISOString(),
      requestId,
    });
  }

  /**
   * Create a paginated response compatible with ShadCN Table
   * @param items Array of items for the current page
   * @param totalItems Total number of items across all pages
   * @param currentPage Current page number
   * @param pageSize Number of items per page
   * @param message Success message (default: 'Success')
   * @param statusCode HTTP status code (default: 200)
   * @param requestId Optional request ID
   * @returns ApiResponse<T> instance with meta field
   */
  static paginated<T>(
    items: T,
    totalItems: number,
    currentPage: number,
    pageSize: number,
    message = 'Success',
    statusCode = 200,
    requestId?: string,
  ): ApiResponse<T> {
    const totalPages = Math.ceil(totalItems / pageSize);

    return new ApiResponse<T>({
      success: true,
      statusCode,
      message,
      data: items,
      meta: { totalItems, totalPages, currentPage, pageSize },
      timestamp: new Date().toISOString(),
      requestId,
    });
  }
}
