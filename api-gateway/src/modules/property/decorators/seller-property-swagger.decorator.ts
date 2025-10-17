import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse as SwaggerApiResponse,
  ApiParam,
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
import { SellerPropertySwaggerConstant } from '../constants/seller-property-swagger.constant';
import { RequestCreatePropertyDTO } from '../dtos/request-create-property.dto';
import { UpdatePropertyDTO } from '../dtos/update-property.dto';

/**
 * Seller Property Swagger Decorators
 */

/** Create property (seller only) */
export function ApiCreateProperty() {
  return applyDecorators(
    ApiOperation(SellerPropertySwaggerConstant.OPERATIONS.CREATE_PROPERTY),
    ApiBody({
      description: 'Create a new property',
      required: true,
      type: RequestCreatePropertyDTO,
      examples: {
        default: {
          summary: 'Example Request',
          value: SellerPropertySwaggerConstant.REQUESTS.REQUEST_CREATE_PROPERTY,
        },
      },
    }),
    SwaggerApiResponse(
      SellerPropertySwaggerConstant.RESPONSES.CREATE_PROPERTY_RESPONSE,
    ),
    ApiUnauthorizedResponse(
      SellerPropertySwaggerConstant.ERRORS.UNAUTHORIZED.errorName,
      SellerPropertySwaggerConstant.ERRORS.UNAUTHORIZED.message,
    ),
    ApiForbiddenResponse(
      SellerPropertySwaggerConstant.ERRORS.FORBIDDEN.errorName,
      SellerPropertySwaggerConstant.ERRORS.FORBIDDEN.message,
    ),
    ApiBadRequestResponse(
      SellerPropertySwaggerConstant.ERRORS.VALIDATION_ERROR.errorName,
      SellerPropertySwaggerConstant.ERRORS.VALIDATION_ERROR.message,
    ),
    ApiServiceUnavailableResponse(
      SellerPropertySwaggerConstant.ERRORS.PROPERTY_SERVICE_UNAVAILABLE
        .errorName,
      SellerPropertySwaggerConstant.ERRORS.PROPERTY_SERVICE_UNAVAILABLE.message,
    ),
    ApiInternalErrorResponse(),
  );
}

/** Get properties by owner (seller only) */
export function ApiGetPropertiesByOwner() {
  return applyDecorators(
    ApiOperation(
      SellerPropertySwaggerConstant.OPERATIONS.GET_PROPERTIES_BY_OWNER,
    ),
    SwaggerApiResponse(
      SellerPropertySwaggerConstant.RESPONSES.GET_PROPERTIES_BY_OWNER_RESPONSE,
    ),
    ApiUnauthorizedResponse(
      SellerPropertySwaggerConstant.ERRORS.UNAUTHORIZED.errorName,
      SellerPropertySwaggerConstant.ERRORS.UNAUTHORIZED.message,
    ),
    ApiForbiddenResponse(
      SellerPropertySwaggerConstant.ERRORS.FORBIDDEN.errorName,
      SellerPropertySwaggerConstant.ERRORS.FORBIDDEN.message,
    ),
    ApiServiceUnavailableResponse(
      SellerPropertySwaggerConstant.ERRORS.PROPERTY_SERVICE_UNAVAILABLE
        .errorName,
      SellerPropertySwaggerConstant.ERRORS.PROPERTY_SERVICE_UNAVAILABLE.message,
    ),
    ApiInternalErrorResponse(),
  );
}

/** Update property (seller only) */
export function ApiUpdateProperty() {
  return applyDecorators(
    ApiOperation(SellerPropertySwaggerConstant.OPERATIONS.UPDATE_PROPERTY),
    ApiParam(SellerPropertySwaggerConstant.PARAMETERS.PROPERTY_ID),
    ApiBody({
      description: 'Update property',
      type: UpdatePropertyDTO,
      required: true,
      examples: {
        default: {
          summary: 'Update Property',
          value: SellerPropertySwaggerConstant.REQUESTS.UPDATE_PROPERTY,
        },
      },
    }),
    SwaggerApiResponse(
      SellerPropertySwaggerConstant.RESPONSES.UPDATE_PROPERTY_RESPONSE,
    ),
    ApiUnauthorizedResponse(
      SellerPropertySwaggerConstant.ERRORS.UNAUTHORIZED.errorName,
      SellerPropertySwaggerConstant.ERRORS.UNAUTHORIZED.message,
    ),
    ApiForbiddenResponse(
      SellerPropertySwaggerConstant.ERRORS.FORBIDDEN.errorName,
      SellerPropertySwaggerConstant.ERRORS.FORBIDDEN.message,
    ),
    ApiNotFoundResponse(
      SellerPropertySwaggerConstant.ERRORS.PROPERTY_NOT_FOUND.errorName,
      SellerPropertySwaggerConstant.ERRORS.PROPERTY_NOT_FOUND.message,
    ),
    ApiBadRequestResponse(
      SellerPropertySwaggerConstant.ERRORS.VALIDATION_ERROR.errorName,
      SellerPropertySwaggerConstant.ERRORS.VALIDATION_ERROR.message,
    ),
    ApiServiceUnavailableResponse(
      SellerPropertySwaggerConstant.ERRORS.PROPERTY_SERVICE_UNAVAILABLE
        .errorName,
      SellerPropertySwaggerConstant.ERRORS.PROPERTY_SERVICE_UNAVAILABLE.message,
    ),
    ApiInternalErrorResponse(),
  );
}

/** Submit property for approval (seller only) */
export function ApiSubmitForApproval() {
  return applyDecorators(
    ApiOperation(SellerPropertySwaggerConstant.OPERATIONS.SUBMIT_FOR_APPROVAL),
    ApiParam(SellerPropertySwaggerConstant.PARAMETERS.PROPERTY_ID),
    SwaggerApiResponse(
      SellerPropertySwaggerConstant.RESPONSES.SUBMIT_APPROVAL_RESPONSE,
    ),
    ApiUnauthorizedResponse(
      SellerPropertySwaggerConstant.ERRORS.UNAUTHORIZED.errorName,
      SellerPropertySwaggerConstant.ERRORS.UNAUTHORIZED.message,
    ),
    ApiForbiddenResponse(
      SellerPropertySwaggerConstant.ERRORS.FORBIDDEN.errorName,
      SellerPropertySwaggerConstant.ERRORS.FORBIDDEN.message,
    ),
    ApiNotFoundResponse(
      SellerPropertySwaggerConstant.ERRORS.PROPERTY_NOT_FOUND.errorName,
      SellerPropertySwaggerConstant.ERRORS.PROPERTY_NOT_FOUND.message,
    ),
    ApiBadRequestResponse(
      SellerPropertySwaggerConstant.ERRORS.INVALID_OPERATION.errorName,
      SellerPropertySwaggerConstant.ERRORS.INVALID_OPERATION.message,
    ),
    ApiServiceUnavailableResponse(
      SellerPropertySwaggerConstant.ERRORS.PROPERTY_SERVICE_UNAVAILABLE
        .errorName,
      SellerPropertySwaggerConstant.ERRORS.PROPERTY_SERVICE_UNAVAILABLE.message,
    ),
    ApiInternalErrorResponse(),
  );
}
