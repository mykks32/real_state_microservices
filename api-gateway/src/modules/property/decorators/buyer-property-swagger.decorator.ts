import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse as SwaggerApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import {
  ApiBadRequestResponse,
  ApiInternalErrorResponse,
  ApiNotFoundResponse,
  ApiServiceUnavailableResponse,
} from '../../../common/decorators/swagger-error.decorator';
import { BuyerPropertySwaggerConstant } from '../constants/buyer-swagger.constant';

/**
 * Public Property Swagger Decorators
 */

/** Get property by ID (public) */
export function ApiGetPropertyById() {
  return applyDecorators(
    ApiOperation(BuyerPropertySwaggerConstant.OPERATIONS.GET_PROPERTY_BY_ID),
    ApiParam(BuyerPropertySwaggerConstant.PARAMETERS.PROPERTY_ID),
    SwaggerApiResponse(
      BuyerPropertySwaggerConstant.RESPONSES.PROPERTY_RESPONSE,
    ),
    ApiBadRequestResponse(
      BuyerPropertySwaggerConstant.ERRORS.INVALID_PROPERTY_ID.errorName,
      BuyerPropertySwaggerConstant.ERRORS.INVALID_PROPERTY_ID.message,
    ),
    ApiNotFoundResponse(
      BuyerPropertySwaggerConstant.ERRORS.PROPERTY_NOT_FOUND.errorName,
      BuyerPropertySwaggerConstant.ERRORS.PROPERTY_NOT_FOUND.message,
    ),
    ApiServiceUnavailableResponse(
      BuyerPropertySwaggerConstant.ERRORS.PROPERTY_SERVICE_UNAVAILABLE
        .errorName,
      BuyerPropertySwaggerConstant.ERRORS.PROPERTY_SERVICE_UNAVAILABLE.message,
    ),
    ApiInternalErrorResponse(),
  );
}

/** Get approved properties (public) */
export function ApiGetApprovedProperties() {
  return applyDecorators(
    ApiOperation(
      BuyerPropertySwaggerConstant.OPERATIONS.GET_APPROVED_PROPERTIES,
    ),
    ApiQuery(BuyerPropertySwaggerConstant.QUERY.PAGINATION.page),
    ApiQuery(BuyerPropertySwaggerConstant.QUERY.PAGINATION.limit),
    SwaggerApiResponse(
      BuyerPropertySwaggerConstant.RESPONSES.APPROVED_PROPERTIES_RESPONSE,
    ),
    ApiServiceUnavailableResponse(
      BuyerPropertySwaggerConstant.ERRORS.PROPERTY_SERVICE_UNAVAILABLE
        .errorName,
      BuyerPropertySwaggerConstant.ERRORS.PROPERTY_SERVICE_UNAVAILABLE.message,
    ),
    ApiInternalErrorResponse(),
  );
}

/** Filter properties (public) */
export function ApiFilterProperties() {
  return applyDecorators(
    ApiOperation(BuyerPropertySwaggerConstant.OPERATIONS.FILTER_PROPERTIES),

    ApiQuery(BuyerPropertySwaggerConstant.QUERY.FILTERS.status),
    ApiQuery(BuyerPropertySwaggerConstant.QUERY.FILTERS.type),
    ApiQuery(BuyerPropertySwaggerConstant.QUERY.FILTERS.state),
    ApiQuery(BuyerPropertySwaggerConstant.QUERY.PAGINATION.page),
    ApiQuery(BuyerPropertySwaggerConstant.QUERY.PAGINATION.limit),

    SwaggerApiResponse(
      BuyerPropertySwaggerConstant.RESPONSES.FILTERED_PROPERTIES_RESPONSE,
    ),

    ApiBadRequestResponse(
      BuyerPropertySwaggerConstant.ERRORS.INVALID_PROPERTY_ID.errorName,
      BuyerPropertySwaggerConstant.ERRORS.INVALID_PROPERTY_ID.message,
    ),

    ApiServiceUnavailableResponse(
      BuyerPropertySwaggerConstant.ERRORS.PROPERTY_SERVICE_UNAVAILABLE.errorName,
      BuyerPropertySwaggerConstant.ERRORS.PROPERTY_SERVICE_UNAVAILABLE.message,
    ),

    ApiInternalErrorResponse(),
  );
}
