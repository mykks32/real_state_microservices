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
    FILTER_PROPERTIES: {
      summary: 'Filter properties',
      description:
        'Retrieves properties filtered by status, type, state, and supports pagination',
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
    FILTERS: {
      status: {
        name: 'status',
        type: String,
        description: 'Filter by property status (Available, Sold, Rented)',
        example: 'Available',
        required: false,
      },
      type: {
        name: 'type',
        type: String,
        description: 'Filter by property type (House, Land)',
        example: 'House',
        required: false,
      },
      state: {
        name: 'state',
        type: String,
        description: 'Filter by state name',
        example: 'Bagmati',
        required: false,
      },
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

    FILTERED_PROPERTIES_RESPONSE: {
      status: 200,
      description: 'Filtered properties fetched successfully',
      type: ApiResponse,
      example: {
        success: true,
        message: 'Filtered properties fetched successfully',
        statusCode: 200,
        data: [
          {
            id: 'a5f6dc9e-55aa-41d1-96ce-7e5a44e88a76',
            title: 'Modern Apartment in Lalitpur',
            description: '2BHK apartment with rooftop access',
            type: 'House',
            status: 'Available',
            approvalStatus: 'approved',
            location: {
              city: 'Lalitpur',
              state: 'Bagmati',
              country: 'Nepal',
            },
            createdAt: '2024-01-20T09:00:00.000Z',
          },
        ],
        meta: {
          totalItems: 7,
          totalPages: 1,
          currentPage: 1,
          pageSize: 10,
        },
        timestamp: '2024-01-20T09:30:00.000Z',
        requestId: 'f4b9c00c-1111-2222-3333-abcdef123456',
      },
    },
  },
};
