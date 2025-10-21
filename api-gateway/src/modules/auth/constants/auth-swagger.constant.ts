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
    LOGOUT: {
      summary: 'Logout user',
      description: 'Clears refresh token cookie and invalidates session',
    },
    ME: {
      summary: 'Get current user',
      description:
        'Returns the authenticated user based on refresh/access token',
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
          user: {
            id: 'c5c06dc8-344d-4e55-9fed-2bf739549390',
            email: 'user@example.com',
            username: 'john_doe',
            roles: ['SELLER', 'BUYER'],
            createdAt: '2024-01-15T10:30:00.000Z',
            lastLoginAt: null,
          },
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

    LOGOUT_RESPONSE: {
      status: 200,
      description: 'User logged out successfully',
      type: ApiResponse,
      example: {
        success: true,
        message: 'Logged out successfully',
        statusCode: 200,
        data: null,
        timestamp: '2024-01-15T10:35:00.000Z',
        requestId: '9fa9c06c-c082-4b6c-9ca7-3f3551700f2f',
      },
    },
    ME_RESPONSE: {
      status: 200,
      description: 'Authenticated user details',
      type: ApiResponse,
      example: {
        success: true,
        message: 'User fetched successfully',
        statusCode: 200,
        data: {
          id: 'c5c06dc8-344d-4e55-9fed-2bf739549390',
          email: 'user@example.com',
          username: 'john_doe',
          roles: ['SELLER', 'BUYER'],
          createdAt: '2024-01-15T10:30:00.000Z',
          lastLoginAt: '2024-01-20T09:20:00.000Z',
        },
        timestamp: '2024-01-20T09:21:00.000Z',
        requestId: '12345-req',
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
