/**
 * Generic API response interface compatible with ShadCN Table.
 * Supports success, error, and paginated responses.
 *
 * @template T - Type of the items in the response data array
 */
export interface IApiResponse<T> {
  /** Indicates whether the request was successful */
  success: boolean;

  /** Optional error name/code for failed requests */
  errorName?: string;

  /** Response message describing the result */
  message: string;

  /** HTTP status code of the response */
  statusCode: number;

  /** Array of items for the current response */
  data?: T;

  /** Optional pagination metadata for paginated responses */
  meta?: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
  };

  /** ISO timestamp when the response was generated */
  timestamp: string;

  /** Optional request identifier for tracing requests */
  requestId?: string;
}
