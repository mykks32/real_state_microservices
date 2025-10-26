/**
 * Swagger constants for Property endpoints
 */
import { ApiResponse } from '../../../common/dtos/response.dto';

/** Property API Swagger documentation constants */
export const AdminPropertySwaggerConstant = {
  /** API tags for grouping endpoints */
  TAGS: {
    ADMIN_PROPERTY: 'admin-property',
  },

  /** API operation metadata */
  OPERATIONS: {
    // Create Property
    CREATE_ADMIN_APPROVED_PROPERTY: {
      summary: 'Create Admin Approved property',
      description: 'Creates a new property listing (Admin only)',
    },
    // Admin Operations
    GET_ALL_PROPERTIES: {
      summary: 'Get all properties',
      description: 'Retrieves all properties (admin only)',
    },
    GET_PENDING_PROPERTIES: {
      summary: 'Get pending properties',
      description: 'Retrieves properties pending approval (admin only)',
    },
    APPROVE_PROPERTY: {
      summary: 'Approve property',
      description: 'Approves a pending property (admin only)',
    },
    REJECT_PROPERTY: {
      summary: 'Reject property',
      description: 'Rejects a pending property (admin only)',
    },
    ARCHIVE_PROPERTY: {
      summary: 'Archive property',
      description: 'Archives an approved property (admin only)',
    },
    DELETE_PROPERTY: {
      summary: 'Delete property',
      description: 'Permanently deletes a property (admin only)',
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
        name: 'size',
        type: Number,
        description: 'Number of items per page',
        example: 10,
        required: false,
      },
    },
  },

  /** API parameter definitions */
  PARAMETERS: {
    PROPERTY_ID: {
      name: 'propertyId',
      type: String,
      description: 'UUID of the property',
      example: 'c5c06dc8-344d-4e55-9fed-2bf739549390',
      required: true,
    },
    ID: {
      name: 'id',
      type: String,
      description: 'Property UUID',
      example: 'c5c06dc8-344d-4e55-9fed-2bf739549390',
      required: true,
    },
  },

  /** Security scheme definitions */
  SECURITY: {
    BEARER_AUTH: 'bearer',
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

  /** Error response definitions */
  ERRORS: {
    INVALID_PROPERTY_ID: {
      errorName: 'INVALID_PROPERTY_ID',
      message: 'Property ID must be a valid UUID',
    },
    PROPERTY_NOT_FOUND: {
      errorName: 'PROPERTY_NOT_FOUND',
      message: 'Property with the given ID was not found',
    },
    PROPERTY_SERVICE_UNAVAILABLE: {
      errorName: 'PROPERTY_SERVICE_UNAVAILABLE',
      message: 'Property service is temporarily unavailable',
    },
    VALIDATION_ERROR: {
      errorName: 'VALIDATION_ERROR',
      message: 'Invalid property data provided',
    },
    INVALID_OPERATION: {
      errorName: 'INVALID_OPERATION',
      message: 'Property is already approved or in invalid state',
    },
    UNAUTHORIZED: {
      errorName: 'UNAUTHORIZED',
      message: 'Authentication required',
    },
    FORBIDDEN: {
      errorName: 'FORBIDDEN',
      message: 'Insufficient permissions',
    },
    APPROVE_OPERATION: {
      errorName: 'INVALID_OPERATION',
      message: 'Property is already approved or in invalid state',
    },
    REJECT_OPERATION: {
      errorName: 'INVALID_OPERATION',
      message: 'Property is already rejected or in invalid state',
    },
    ARCHIVE_OPERATION: {
      errorName: 'INVALID_OPERATION',
      message: 'Property cannot be archived in current state',
    },
    DELETE_OPERATION: {
      errorName: 'INVALID_OPERATION',
      message: 'Property cannot be deleted in current state',
    },
  },

  /** Request examples for seller */
  REQUESTS: {
    REQUEST_CREATE_ADMIN_APPROVED_PROPERTY: {
      title: 'Beautiful House in Pokhara',
      description: '3 BHK house with mountain view',
      type: 'House',
      status: 'Available',
      location: {
        address: '789 Mountain View Road',
        city: 'Pokhara',
        state: 'Gandaki',
        country: 'Nepal',
        zipcode: 33700,
        latitude: 28.2096,
        longitude: 83.9856,
      },
    },
  },

  /** API response examples */
  RESPONSES: {
    // Admin Responses

    CREATE_PROPERTY_RESPONSE: {
      status: 201,
      description: 'Property created successfully',
      type: ApiResponse,
      example: {
        success: true,
        message: 'Property created successfully',
        statusCode: 201,
        data: {
          id: 'c5c06dc8-344d-4e55-9fed-2bf739549390',
          title: 'Beautiful House in Pokhara',
          description: '3 BHK house with mountain view',
          type: 'House',
          status: 'Available',
          approvalStatus: 'draft',
          ownerId: 'a1b2c3d4-5678-90ef-ghij-klmnopqrstuv',
          location: {
            id: 1,
            address: '789 Mountain View Road',
            city: 'Pokhara',
            state: 'Gandaki',
            country: 'Nepal',
            zipcode: 33700,
            latitude: 28.2096,
            longitude: 83.9856,
            createdAt: '2024-01-15T10:30:00.000Z',
            updatedAt: '2024-01-15T10:30:00.000Z',
          },
          createdAt: '2024-01-15T10:30:00.000Z',
          updatedAt: '2024-01-15T10:30:00.000Z',
        },
        timestamp: '2024-01-15T10:35:00.000Z',
        requestId: '9fa9c06c-c082-4b6c-9ca7-3f3551700f2f',
      },
    },

    ALL_PROPERTIES_RESPONSE: {
      status: 200,
      description: 'All properties retrieved successfully',
      type: ApiResponse,
      example: {
        success: true,
        message: 'All properties retrieved successfully',
        statusCode: 200,
        data: [
          {
            id: 'c5c06dc8-344d-4e55-9fed-2bf739549390',
            title: 'Modern House in Kathmandu',
            description: 'Beautiful house with modern amenities',
            type: 'House',
            status: 'Available',
            approvalStatus: 'approved',
            ownerId: 'a1b2c3d4-5678-90ef-ghij-klmnopqrstuv',
            location: {
              id: 1,
              address: '123 Lakeside Road',
              city: 'Pokhara',
              state: 'Gandaki',
              country: 'Nepal',
              zipcode: 33700,
              latitude: 28.2096,
              longitude: 83.9856,
              createdAt: '2024-01-15T10:30:00.000Z',
              updatedAt: '2024-01-15T10:30:00.000Z',
            },
            createdAt: '2024-01-15T10:30:00.000Z',
            updatedAt: '2024-01-15T10:30:00.000Z',
          },
          {
            id: 'd6d17ed9-455e-5f66-0ghe-3cg470281f3w',
            title: 'Pending Land Plot',
            description: '500 sq. ft. land plot',
            type: 'Land',
            status: 'Available',
            approvalStatus: 'pending_approval',
            ownerId: 'b2c3d4e5-6789-01fg-hijk-lmnopqrstuvw',
            location: {
              id: 2,
              address: '456 Jungle Road',
              city: 'Chitwan',
              state: 'Bagmati',
              country: 'Nepal',
              zipcode: 44200,
              latitude: 27.5,
              longitude: 84.3333,
              createdAt: '2024-01-14T09:15:00.000Z',
              updatedAt: '2024-01-14T09:15:00.000Z',
            },
            createdAt: '2024-01-14T09:15:00.000Z',
            updatedAt: '2024-01-14T09:15:00.000Z',
          },
        ],
        timestamp: '2024-01-15T10:35:00.000Z',
        requestId: '9fa9c06c-c082-4b6c-9ca7-3f3551700f2f',
      },
    },

    PENDING_PROPERTIES_RESPONSE: {
      status: 200,
      description: 'Pending properties retrieved successfully',
      type: ApiResponse,
      example: {
        success: true,
        message: 'Pending properties retrieved successfully',
        statusCode: 200,
        data: [
          {
            id: 'd6d17ed9-455e-5f66-0ghe-3cg470281f3w',
            title: 'Land Plot in Chitwan',
            description: '500 sq. ft. land plot near national park',
            type: 'Land',
            status: 'Available',
            approvalStatus: 'pending_approval',
            ownerId: 'b2c3d4e5-6789-01fg-hijk-lmnopqrstuvw',
            location: {
              id: 2,
              address: '456 Jungle Road',
              city: 'Chitwan',
              state: 'Bagmati',
              country: 'Nepal',
              zipcode: 44200,
              latitude: 27.5,
              longitude: 84.3333,
              createdAt: '2024-01-14T09:15:00.000Z',
              updatedAt: '2024-01-14T09:15:00.000Z',
            },
            createdAt: '2024-01-14T09:15:00.000Z',
            updatedAt: '2024-01-14T09:15:00.000Z',
          },
        ],
        timestamp: '2024-01-15T10:35:00.000Z',
        requestId: '9fa9c06c-c082-4b6c-9ca7-3f3551700f2f',
      },
    },

    APPROVAL_RESPONSE: {
      status: 200,
      description: 'Property approved successfully',
      type: ApiResponse,
      example: {
        success: true,
        message: 'Property approved successfully',
        statusCode: 200,
        data: {
          approval: true,
          message: 'Property has been approved for listing',
        },
        timestamp: '2024-01-15T10:35:00.000Z',
        requestId: '9fa9c06c-c082-4b6c-9ca7-3f3551700f2f',
      },
    },

    REJECTION_RESPONSE: {
      status: 200,
      description: 'Property rejected successfully',
      type: ApiResponse,
      example: {
        success: true,
        message: 'Property rejected successfully',
        statusCode: 200,
        data: {
          approval: false,
          message: 'Property has been rejected',
        },
        timestamp: '2024-01-15T10:35:00.000Z',
        requestId: '9fa9c06c-c082-4b6c-9ca7-3f3551700f2f',
      },
    },

    ARCHIVE_RESPONSE: {
      status: 200,
      description: 'Property archived successfully',
      type: ApiResponse,
      example: {
        success: true,
        message: 'Property archived successfully',
        statusCode: 200,
        data: {
          approval: true,
          message: 'Property has been archived',
        },
        timestamp: '2024-01-15T10:35:00.000Z',
        requestId: '9fa9c06c-c082-4b6c-9ca7-3f3551700f2f',
      },
    },

    DELETE_RESPONSE: {
      status: 200,
      description: 'Property deleted successfully',
      type: ApiResponse,
      example: {
        success: true,
        message: 'Property deleted successfully',
        statusCode: 200,
        data: true,
        timestamp: '2024-01-15T10:35:00.000Z',
        requestId: '9fa9c06c-c082-4b6c-9ca7-3f3551700f2f',
      },
    },
  },
};
