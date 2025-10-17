/**
 * Swagger constants for Public Property endpoints
 */
import { ApiResponse } from '../../../common/dtos/response.dto';

/** Public Property API Swagger documentation constants */
export const BuyerPropertySwaggerConstant = {
  /** API tags for public endpoints */
  TAGS: {
    BUYER_PROPERTY: 'buyer-property',
  },

  /** API operation metadata for public endpoints */
  OPERATIONS: {
    GET_PROPERTY_BY_ID: {
      summary: 'Get property by ID',
      description: 'Retrieves a specific property by its unique identifier',
    },
    GET_APPROVED_PROPERTIES: {
      summary: 'Get approved properties',
      description:
        'Retrieves all properties that have been approved for listing',
    },
  },

  /** API parameter definitions for public endpoints */
  PARAMETERS: {
    PROPERTY_ID: {
      name: 'propertyId',
      type: String,
      description: 'UUID of the property',
      example: 'c5c06dc8-344d-4e55-9fed-2bf739549390',
      required: true,
    },
  },

  /** Error Messages for public operations */
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
  },

  /** Response examples for public endpoints */
  RESPONSES: {
    PROPERTY_RESPONSE: {
      status: 200,
      description: 'Property retrieved successfully',
      type: ApiResponse,
      example: {
        success: true,
        message: 'Property retrieved successfully',
        statusCode: 200,
        data: {
          id: 'c5c06dc8-344d-4e55-9fed-2bf739549390',
          title: 'Beautiful House in Kathmandu',
          description: '3 BHK house with garden and parking',
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
        timestamp: '2024-01-15T10:35:00.000Z',
        requestId: '9fa9c06c-c082-4b6c-9ca7-3f3551700f2f',
      },
    },

    APPROVED_PROPERTIES_RESPONSE: {
      status: 200,
      description: 'Approved properties retrieved successfully',
      type: ApiResponse,
      example: {
        success: true,
        message: 'Approved properties retrieved successfully',
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
            title: 'Land Plot in Chitwan',
            description: '500 sq. ft. land plot near national park',
            type: 'Land',
            status: 'Available',
            approvalStatus: 'approved',
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
  },
};
