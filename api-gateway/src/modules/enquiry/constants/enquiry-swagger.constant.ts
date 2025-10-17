/**
 * Swagger constants for Enquiry endpoints
 */
import { ApiResponse } from '../../../common/dtos/response.dto';

/** Enquiry API Swagger documentation constants */
export const EnquirySwaggerConstant = {
  /** API tags for enquiry endpoints */
  TAGS: {
    ENQUIRY: 'enquiry',
  },

  /** API operation metadata for enquiry */
  OPERATIONS: {
    GET_ALL_ENQUIRIES: {
      summary: 'Get all enquiries',
      description: 'Retrieves paginated list of all enquiries (admin only)',
    },
    GET_ENQUIRY_BY_ID: {
      summary: 'Get enquiry by ID',
      description:
        'Retrieves a specific enquiry by its unique identifier (admin only)',
    },
    GET_ENQUIRIES_BY_PROPERTY: {
      summary: 'Get enquiries by property',
      description:
        'Retrieves paginated enquiries for a specific property (admin/seller)',
    },
    UPDATE_ENQUIRY_STATUS: {
      summary: 'Update enquiry status',
      description: 'Updates the status of an enquiry (admin only)',
    },
    CREATE_ENQUIRY: {
      summary: 'Create enquiry',
      description: 'Creates a new property enquiry (admin/seller/buyer)',
    },
  },

  /** API parameter definitions for enquiry */
  PARAMETERS: {
    ENQUIRY_ID: {
      name: 'enquiryId',
      type: String,
      description: 'UUID of the enquiry',
      example: 'c5c06dc8-344d-4e55-9fed-2bf739549390',
      required: true,
    },
    PROPERTY_ID: {
      name: 'propertyId',
      type: String,
      description: 'UUID of the property',
      example: 'c5c06dc8-344d-4e55-9fed-2bf739549390',
      required: true,
    },
  },

  /** Security scheme definitions */
  SECURITY: {
    BEARER_AUTH: 'Bearer',
    COOKIE_AUTH: 'cookie',
  },

  /** Cookie authentication requirements */
  COOKIES: {
    REALSTATE_TOKEN: {
      name: 'realState_token',
      description: 'HTTP-only refresh token cookie',
      required: true,
      example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    },
  },

  /** Request header definitions */
  HEADERS: {
    X_REQUEST_ID: {
      name: 'x-request-id',
      description: 'Unique request identifier for tracing',
      example: '9fa9c06c-c082-4b6c-9ca7-3f3551700f2f',
      required: false,
    },
    AUTHORIZATION: {
      name: 'authorization',
      description: 'Bearer token for authentication',
      example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      required: true,
    },
  },

  /** Query parameter definitions */
  QUERY: {
    PAGINATION: {
      page: {
        name: 'page',
        type: Number,
        description: 'Page number for pagination',
        example: 1,
        required: false,
      },
      limit: {
        name: 'limit',
        type: Number,
        description: 'Number of items per page',
        example: 10,
        required: false,
      },
    },
  },

  /** Error Messages for enquiry operations */
  ERRORS: {
    ENQUIRY_NOT_FOUND: {
      errorName: 'ENQUIRY_NOT_FOUND',
      message: 'Enquiry with the given ID was not found',
    },
    PROPERTY_NOT_FOUND: {
      errorName: 'PROPERTY_NOT_FOUND',
      message: 'Property with the given ID was not found',
    },
    ENQUIRY_SERVICE_UNAVAILABLE: {
      errorName: 'ENQUIRY_SERVICE_UNAVAILABLE',
      message: 'Enquiry service is temporarily unavailable',
    },
    VALIDATION_ERROR: {
      errorName: 'VALIDATION_ERROR',
      message: 'Invalid enquiry data provided',
    },
    UNAUTHORIZED: {
      errorName: 'UNAUTHORIZED',
      message: 'Authentication required',
    },
    FORBIDDEN: {
      errorName: 'FORBIDDEN',
      message: 'Insufficient permissions',
    },
  },

  /** Response examples for enquiry endpoints */
  RESPONSES: {
    ENQUIRY_RESPONSE: {
      status: 200,
      description: 'Enquiry retrieved successfully',
      type: ApiResponse,
      example: {
        success: true,
        message: 'Enquiry retrieved successfully',
        statusCode: 200,
        data: {
          id: 'c5c06dc8-344d-4e55-9fed-2bf739549390',
          property_id: 'a1b2c3d4-5678-90ef-ghij-klmnopqrstuv',
          user_id: 'b2c3d4e5-6789-01fg-hijk-lmnopqrstuvw',
          message: 'I am interested in this property. Please contact me.',
          status: 'pending',
          created_at: '2024-01-15T10:30:00.000Z',
          updated_at: '2024-01-15T10:30:00.000Z',
        },
        timestamp: '2024-01-15T10:35:00.000Z',
        requestId: '9fa9c06c-c082-4b6c-9ca7-3f3551700f2f',
      },
    },

    ENQUIRIES_LIST_RESPONSE: {
      status: 200,
      description: 'Enquiries retrieved successfully',
      type: ApiResponse,
      example: {
        success: true,
        message: 'Enquiries retrieved successfully',
        statusCode: 200,
        data: [
          {
            id: 'c5c06dc8-344d-4e55-9fed-2bf739549390',
            property_id: 'a1b2c3d4-5678-90ef-ghij-klmnopqrstuv',
            user_id: 'b2c3d4e5-6789-01fg-hijk-lmnopqrstuvw',
            message: 'I am interested in this property. Please contact me.',
            status: 'pending',
            created_at: '2024-01-15T10:30:00.000Z',
            updated_at: '2024-01-15T10:30:00.000Z',
          },
          {
            id: 'd6d17ed9-455e-5f66-0ghe-3cg470281f3w',
            property_id: 'a1b2c3d4-5678-90ef-ghij-klmnopqrstuv',
            user_id: 'c3d4e5f6-7890-12gh-ijkl-mnopqrstuvwx',
            message: 'Can I schedule a visit for this weekend?',
            status: 'contacted',
            created_at: '2024-01-14T09:15:00.000Z',
            updated_at: '2024-01-14T14:20:00.000Z',
          },
        ],
        timestamp: '2024-01-15T10:35:00.000Z',
        requestId: '9fa9c06c-c082-4b6c-9ca7-3f3551700f2f',
      },
    },

    UPDATE_STATUS_RESPONSE: {
      status: 200,
      description: 'Enquiry status updated successfully',
      type: ApiResponse,
      example: {
        success: true,
        message: 'Enquiry status updated successfully',
        statusCode: 200,
        data: {
          id: 'c5c06dc8-344d-4e55-9fed-2bf739549390',
          property_id: 'a1b2c3d4-5678-90ef-ghij-klmnopqrstuv',
          user_id: 'b2c3d4e5-6789-01fg-hijk-lmnopqrstuvw',
          message: 'I am interested in this property. Please contact me.',
          status: 'contacted',
          created_at: '2024-01-15T10:30:00.000Z',
          updated_at: '2024-01-16T14:20:00.000Z',
        },
        timestamp: '2024-01-16T14:20:00.000Z',
        requestId: '9fa9c06c-c082-4b6c-9ca7-3f3551700f2f',
      },
    },

    CREATE_ENQUIRY_RESPONSE: {
      status: 201,
      description: 'Enquiry created successfully',
      type: ApiResponse,
      example: {
        success: true,
        message: 'Enquiry created successfully',
        statusCode: 201,
        data: {
          id: 'c5c06dc8-344d-4e55-9fed-2bf739549390',
          property_id: 'a1b2c3d4-5678-90ef-ghij-klmnopqrstuv',
          user_id: 'b2c3d4e5-6789-01fg-hijk-lmnopqrstuvw',
          message: 'I am interested in this property. Please contact me.',
          status: 'pending',
          created_at: '2024-01-15T10:30:00.000Z',
          updated_at: '2024-01-15T10:30:00.000Z',
        },
        timestamp: '2024-01-15T10:35:00.000Z',
        requestId: '9fa9c06c-c082-4b6c-9ca7-3f3551700f2f',
      },
    },
  },

  /** Request examples for enquiry */
  REQUESTS: {
    CREATE_ENQUIRY: {
      property_id: 'a1b2c3d4-5678-90ef-ghij-klmnopqrstuv',
      message: 'I am interested in this property. Please contact me.',
    },

    UPDATE_STATUS: {
      status: 'contacted',
    },
  },
};
