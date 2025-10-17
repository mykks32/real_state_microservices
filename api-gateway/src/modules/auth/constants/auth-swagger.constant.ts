/**
 * Swagger constants for Auth endpoints
 */
import { ApiResponse } from '../../../common/dtos/response.dto';

/** Auth API Swagger documentation constants */
export const AuthSwaggerConstant = {
  /** API tags for auth endpoints */
  TAGS: {
    AUTH: 'auth',
  },

  /** API operation metadata for auth */
  OPERATIONS: {
    LOGIN: {
      summary: 'User login',
      description:
        'Authenticates user and returns access token with refresh token cookie',
    },
    REGISTER: {
      summary: 'Register a new user',
      description:
        'Creates a new user account with email, username, and password',
    },
  },

  /** Error Messages for auth operations */
  ERRORS: {
    VALIDATION_ERROR: {
      errorName: 'VALIDATION_ERROR',
      message: 'Invalid email or password format',
    },
    INVALID_CREDENTIALS: {
      errorName: 'INVALID_CREDENTIALS',
      message: 'Invalid email or password',
    },
    USER_ALREADY_EXISTS: {
      errorName: 'USER_ALREADY_EXISTS',
      message: 'User with this email already exists',
    },
    AUTH_SERVICE_UNAVAILABLE: {
      errorName: 'AUTH_SERVICE_UNAVAILABLE',
      message: 'Authentication service is temporarily unavailable',
    },
  },

  /** Response examples for auth endpoints */
  RESPONSES: {
    LOGIN_RESPONSE: {
      status: 200,
      description: 'Successfully logged in',
      type: ApiResponse,
      example: {
        success: true,
        message: 'Successfully logged in',
        statusCode: 200,
        data: {
          accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
        timestamp: '2024-01-15T10:35:00.000Z',
        requestId: '9fa9c06c-c082-4b6c-9ca7-3f3551700f2f',
      },
    },

    REGISTER_RESPONSE: {
      status: 201,
      description: 'User registered successfully',
      type: ApiResponse,
      example: {
        success: true,
        message: 'User registered successfully',
        statusCode: 201,
        data: {
          id: 'c5c06dc8-344d-4e55-9fed-2bf739549390',
          email: 'user@example.com',
          username: 'john_doe',
          roles: ['SELLER', 'BUYER'],
          createdAt: '2024-01-15T10:30:00.000Z',
          lastLoginAt: null,
        },
        timestamp: '2024-01-15T10:35:00.000Z',
        requestId: '9fa9c06c-c082-4b6c-9ca7-3f3551700f2f',
      },
    },
  },

  /** Cookie definitions */
  COOKIES: {
    REALSTATE_TOKEN: {
      name: 'realState_token',
      description: 'HTTP-only refresh token cookie for authentication',
      example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    },
  },
};
