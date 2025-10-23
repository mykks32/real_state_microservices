/**
 * Swagger constants for Seller Property endpoints
 */
import { ApiResponse } from '../../../common/dtos/response.dto';

/** Seller Property API Swagger documentation constants */
export const SellerPropertySwaggerConstant = {
  /** API tags for seller endpoints */
  TAGS: {
    SELLER_PROPERTY: 'seller-property',
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

  /** API operation metadata for seller */
  OPERATIONS: {
    CREATE_PROPERTY: {
      summary: 'Create property',
      description: 'Creates a new property listing (seller only)',
    },
    GET_PROPERTIES_BY_OWNER: {
      summary: 'Get my properties',
      description: 'Retrieves all properties owned by the current seller',
    },
    UPDATE_PROPERTY: {
      summary: 'Update property',
      description: 'Updates an existing property (seller only)',
    },
    SUBMIT_FOR_APPROVAL: {
      summary: 'Submit for approval',
      description: 'Submits a property for admin approval (seller only)',
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

  /** API parameter definitions for seller */
  PARAMETERS: {
    PROPERTY_ID: {
      name: 'propertyId',
      type: String,
      description: 'UUID of the property',
      example: 'c5c06dc8-344d-4e55-9fed-2bf739549390',
      required: true,
    },
  },

  /** Error Messages for seller operations */
  ERRORS: {
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
    UNAUTHORIZED: {
      errorName: 'UNAUTHORIZED',
      message: 'Authentication required',
    },
    FORBIDDEN: {
      errorName: 'FORBIDDEN',
      message: 'Insufficient permissions - SELLER role required',
    },
    INVALID_OPERATION: {
      errorName: 'INVALID_OPERATION',
      message: 'Property cannot be submitted in current state',
    },
  },

  /** Response examples for seller endpoints */
  RESPONSES: {
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

    GET_PROPERTIES_BY_OWNER_RESPONSE: {
      status: 200,
      description: 'Properties retrieved successfully',
      type: ApiResponse,
      example: {
        success: true,
        message: 'Properties retrieved successfully',
        statusCode: 200,
        data: [
          {
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
          {
            id: 'd6d17ed9-455e-5f66-0ghe-3cg470281f3w',
            title: 'Land Plot in Chitwan',
            description: '500 sq. ft. land plot near national park',
            type: 'Land',
            status: 'Available',
            approvalStatus: 'pending_approval',
            ownerId: 'a1b2c3d4-5678-90ef-ghij-klmnopqrstuv',
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

    UPDATE_PROPERTY_RESPONSE: {
      status: 200,
      description: 'Property updated successfully',
      type: ApiResponse,
      example: {
        success: true,
        message: 'Property updated successfully',
        statusCode: 200,
        data: {
          id: 'c5c06dc8-344d-4e55-9fed-2bf739549390',
          title: 'Updated Beautiful House in Pokhara',
          description: 'Recently renovated 3 BHK house with mountain view',
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
            zipcode: 33701,
            latitude: 28.2096,
            longitude: 83.9856,
            createdAt: '2024-01-15T10:30:00.000Z',
            updatedAt: '2024-01-16T14:20:00.000Z',
          },
          createdAt: '2024-01-15T10:30:00.000Z',
          updatedAt: '2024-01-16T14:20:00.000Z',
        },
        timestamp: '2024-01-16T14:20:00.000Z',
        requestId: '9fa9c06c-c082-4b6c-9ca7-3f3551700f2f',
      },
    },

    SUBMIT_APPROVAL_RESPONSE: {
      status: 200,
      description: 'Property submitted for approval successfully',
      type: ApiResponse,
      example: {
        success: true,
        message: 'Property submitted for approval successfully',
        statusCode: 200,
        data: {
          approval: true,
          message: 'Property has been submitted for admin approval',
        },
        timestamp: '2024-01-15T10:35:00.000Z',
        requestId: '9fa9c06c-c082-4b6c-9ca7-3f3551700f2f',
      },
    },
  },

  /** Request examples for seller */
  REQUESTS: {
    REQUEST_CREATE_PROPERTY: {
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

    UPDATE_PROPERTY: {
      title: 'Updated Beautiful House in Pokhara',
      description: 'Recently renovated 3 BHK house with mountain view',
      status: 'Rented',
      location: {
        city: 'Pokhara',
        zipcode: 33701,
      },
    },
  },
};
