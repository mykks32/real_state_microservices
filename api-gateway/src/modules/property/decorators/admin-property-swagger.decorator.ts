import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse as SwaggerApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiInternalErrorResponse,
  ApiNotFoundResponse,
  ApiServiceUnavailableResponse,
  ApiUnauthorizedResponse,
} from '../../../common/decorators/swagger-error.decorator';
import { AdminPropertySwaggerConstant } from '../constants/admin-property-swagger.constant';
import { RequestCreatePropertyDTO } from '../dtos/request-create-property.dto';

/**
 * Admin Property Swagger Decorators
 * Consolidated decorators for admin property endpoints
 */

/** Get all properties (admin only) */
export function ApiGetAllProperties() {
  return applyDecorators(
    ApiOperation(AdminPropertySwaggerConstant.OPERATIONS.GET_ALL_PROPERTIES),
    ApiQuery(AdminPropertySwaggerConstant.QUERY.PAGINATION.page),
    ApiQuery(AdminPropertySwaggerConstant.QUERY.PAGINATION.limit),
    SwaggerApiResponse(
      AdminPropertySwaggerConstant.RESPONSES.ALL_PROPERTIES_RESPONSE,
    ),
    ApiUnauthorizedResponse(
      AdminPropertySwaggerConstant.ERRORS.UNAUTHORIZED.errorName,
      AdminPropertySwaggerConstant.ERRORS.UNAUTHORIZED.message,
    ),
    ApiForbiddenResponse(
      AdminPropertySwaggerConstant.ERRORS.FORBIDDEN.errorName,
      AdminPropertySwaggerConstant.ERRORS.FORBIDDEN.message,
    ),
    ApiServiceUnavailableResponse(
      AdminPropertySwaggerConstant.ERRORS.PROPERTY_SERVICE_UNAVAILABLE
        .errorName,
      AdminPropertySwaggerConstant.ERRORS.PROPERTY_SERVICE_UNAVAILABLE.message,
    ),
    ApiInternalErrorResponse(),
  );
}

/** Get pending properties awaiting approval */
export function ApiGetPendingProperties() {
  return applyDecorators(
    ApiOperation(
      AdminPropertySwaggerConstant.OPERATIONS.GET_PENDING_PROPERTIES,
    ),
    ApiQuery(AdminPropertySwaggerConstant.QUERY.PAGINATION.page),
    ApiQuery(AdminPropertySwaggerConstant.QUERY.PAGINATION.limit),
    SwaggerApiResponse(
      AdminPropertySwaggerConstant.RESPONSES.PENDING_PROPERTIES_RESPONSE,
    ),
    ApiUnauthorizedResponse(
      AdminPropertySwaggerConstant.ERRORS.UNAUTHORIZED.errorName,
      AdminPropertySwaggerConstant.ERRORS.UNAUTHORIZED.message,
    ),
    ApiForbiddenResponse(
      AdminPropertySwaggerConstant.ERRORS.FORBIDDEN.errorName,
      AdminPropertySwaggerConstant.ERRORS.FORBIDDEN.message,
    ),
    ApiServiceUnavailableResponse(
      AdminPropertySwaggerConstant.ERRORS.PROPERTY_SERVICE_UNAVAILABLE
        .errorName,
      AdminPropertySwaggerConstant.ERRORS.PROPERTY_SERVICE_UNAVAILABLE.message,
    ),
    ApiInternalErrorResponse(),
  );
}

/** Approve a pending property */
export function ApiApproveProperty() {
  return applyDecorators(
    ApiOperation(AdminPropertySwaggerConstant.OPERATIONS.APPROVE_PROPERTY),
    ApiParam(AdminPropertySwaggerConstant.PARAMETERS.PROPERTY_ID),
    SwaggerApiResponse(
      AdminPropertySwaggerConstant.RESPONSES.APPROVAL_RESPONSE,
    ),
    ApiUnauthorizedResponse(
      AdminPropertySwaggerConstant.ERRORS.UNAUTHORIZED.errorName,
      AdminPropertySwaggerConstant.ERRORS.UNAUTHORIZED.message,
    ),
    ApiForbiddenResponse(
      AdminPropertySwaggerConstant.ERRORS.FORBIDDEN.errorName,
      AdminPropertySwaggerConstant.ERRORS.FORBIDDEN.message,
    ),
    ApiNotFoundResponse(
      AdminPropertySwaggerConstant.ERRORS.PROPERTY_NOT_FOUND.errorName,
      AdminPropertySwaggerConstant.ERRORS.PROPERTY_NOT_FOUND.message,
    ),
    ApiBadRequestResponse(
      AdminPropertySwaggerConstant.ERRORS.INVALID_OPERATION.errorName,
      AdminPropertySwaggerConstant.ERRORS.INVALID_OPERATION.message,
    ),
    ApiServiceUnavailableResponse(
      AdminPropertySwaggerConstant.ERRORS.PROPERTY_SERVICE_UNAVAILABLE
        .errorName,
      AdminPropertySwaggerConstant.ERRORS.PROPERTY_SERVICE_UNAVAILABLE.message,
    ),
    ApiInternalErrorResponse(),
  );
}

/** Reject a pending property */
export function ApiRejectProperty() {
  return applyDecorators(
    ApiOperation(AdminPropertySwaggerConstant.OPERATIONS.REJECT_PROPERTY),
    ApiParam(AdminPropertySwaggerConstant.PARAMETERS.PROPERTY_ID),
    SwaggerApiResponse(
      AdminPropertySwaggerConstant.RESPONSES.REJECTION_RESPONSE,
    ),
    ApiUnauthorizedResponse(
      AdminPropertySwaggerConstant.ERRORS.UNAUTHORIZED.errorName,
      AdminPropertySwaggerConstant.ERRORS.UNAUTHORIZED.message,
    ),
    ApiForbiddenResponse(
      AdminPropertySwaggerConstant.ERRORS.FORBIDDEN.errorName,
      AdminPropertySwaggerConstant.ERRORS.FORBIDDEN.message,
    ),
    ApiNotFoundResponse(
      AdminPropertySwaggerConstant.ERRORS.PROPERTY_NOT_FOUND.errorName,
      AdminPropertySwaggerConstant.ERRORS.PROPERTY_NOT_FOUND.message,
    ),
    ApiBadRequestResponse(
      AdminPropertySwaggerConstant.ERRORS.INVALID_OPERATION.errorName,
      'Property is already rejected or in invalid state',
    ),
    ApiServiceUnavailableResponse(
      AdminPropertySwaggerConstant.ERRORS.PROPERTY_SERVICE_UNAVAILABLE
        .errorName,
      AdminPropertySwaggerConstant.ERRORS.PROPERTY_SERVICE_UNAVAILABLE.message,
    ),
    ApiInternalErrorResponse(),
  );
}

/** Archive an approved property */
export function ApiArchiveProperty() {
  return applyDecorators(
    ApiOperation(AdminPropertySwaggerConstant.OPERATIONS.ARCHIVE_PROPERTY),
    ApiParam(AdminPropertySwaggerConstant.PARAMETERS.PROPERTY_ID),
    SwaggerApiResponse(AdminPropertySwaggerConstant.RESPONSES.ARCHIVE_RESPONSE),
    ApiUnauthorizedResponse(
      AdminPropertySwaggerConstant.ERRORS.UNAUTHORIZED.errorName,
      AdminPropertySwaggerConstant.ERRORS.UNAUTHORIZED.message,
    ),
    ApiForbiddenResponse(
      AdminPropertySwaggerConstant.ERRORS.FORBIDDEN.errorName,
      AdminPropertySwaggerConstant.ERRORS.FORBIDDEN.message,
    ),
    ApiNotFoundResponse(
      AdminPropertySwaggerConstant.ERRORS.PROPERTY_NOT_FOUND.errorName,
      AdminPropertySwaggerConstant.ERRORS.PROPERTY_NOT_FOUND.message,
    ),
    ApiBadRequestResponse(
      AdminPropertySwaggerConstant.ERRORS.INVALID_OPERATION.errorName,
      'Property cannot be archived in current state',
    ),
    ApiServiceUnavailableResponse(
      AdminPropertySwaggerConstant.ERRORS.PROPERTY_SERVICE_UNAVAILABLE
        .errorName,
      AdminPropertySwaggerConstant.ERRORS.PROPERTY_SERVICE_UNAVAILABLE.message,
    ),
    ApiInternalErrorResponse(),
  );
}

/** Permanently delete a property */
export function ApiDeleteProperty() {
  return applyDecorators(
    ApiOperation(AdminPropertySwaggerConstant.OPERATIONS.DELETE_PROPERTY),
    ApiParam(AdminPropertySwaggerConstant.PARAMETERS.PROPERTY_ID),
    SwaggerApiResponse(AdminPropertySwaggerConstant.RESPONSES.DELETE_RESPONSE),
    ApiUnauthorizedResponse(
      AdminPropertySwaggerConstant.ERRORS.UNAUTHORIZED.errorName,
      AdminPropertySwaggerConstant.ERRORS.UNAUTHORIZED.message,
    ),
    ApiForbiddenResponse(
      AdminPropertySwaggerConstant.ERRORS.FORBIDDEN.errorName,
      AdminPropertySwaggerConstant.ERRORS.FORBIDDEN.message,
    ),
    ApiNotFoundResponse(
      AdminPropertySwaggerConstant.ERRORS.PROPERTY_NOT_FOUND.errorName,
      AdminPropertySwaggerConstant.ERRORS.PROPERTY_NOT_FOUND.message,
    ),
    ApiServiceUnavailableResponse(
      AdminPropertySwaggerConstant.ERRORS.PROPERTY_SERVICE_UNAVAILABLE
        .errorName,
      AdminPropertySwaggerConstant.ERRORS.PROPERTY_SERVICE_UNAVAILABLE.message,
    ),
    ApiInternalErrorResponse(),
  );
}

/** Create property (seller only) */
export function ApiAdminCreateProperty() {
  return applyDecorators(
    ApiOperation(
      AdminPropertySwaggerConstant.OPERATIONS.CREATE_ADMIN_APPROVED_PROPERTY,
    ),
    ApiBody({
      description: 'Create a new property',
      required: true,
      type: RequestCreatePropertyDTO,
      examples: {
        default: {
          summary: 'Example Request',
          value:
            AdminPropertySwaggerConstant.REQUESTS
              .REQUEST_CREATE_ADMIN_APPROVED_PROPERTY,
        },
      },
    }),
    SwaggerApiResponse(
      AdminPropertySwaggerConstant.RESPONSES.CREATE_PROPERTY_RESPONSE,
    ),
    ApiUnauthorizedResponse(
      AdminPropertySwaggerConstant.ERRORS.UNAUTHORIZED.errorName,
      AdminPropertySwaggerConstant.ERRORS.UNAUTHORIZED.message,
    ),
    ApiForbiddenResponse(
      AdminPropertySwaggerConstant.ERRORS.FORBIDDEN.errorName,
      AdminPropertySwaggerConstant.ERRORS.FORBIDDEN.message,
    ),
    ApiBadRequestResponse(
      AdminPropertySwaggerConstant.ERRORS.VALIDATION_ERROR.errorName,
      AdminPropertySwaggerConstant.ERRORS.VALIDATION_ERROR.message,
    ),
    ApiServiceUnavailableResponse(
      AdminPropertySwaggerConstant.ERRORS.PROPERTY_SERVICE_UNAVAILABLE
        .errorName,
      AdminPropertySwaggerConstant.ERRORS.PROPERTY_SERVICE_UNAVAILABLE.message,
    ),
    ApiInternalErrorResponse(),
  );
}
