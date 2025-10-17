import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse as SwaggerApiResponse,
  ApiParam,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiInternalErrorResponse,
  ApiNotFoundResponse,
  ApiServiceUnavailableResponse,
  ApiUnauthorizedResponse,
} from '../../../common/decorators/swagger-error.decorator';
import { EnquirySwaggerConstant } from '../constants/enquiry-swagger.constant';
import { CreateEnquiryDto } from '../dtos/create-enquiry.dto';
import { UpdateEnquiryStatusDto } from '../dtos/update-enquiry-status.dto';

/**
 * Enquiry Swagger Decorators
 */

/** Get all enquiries with pagination (admin only) */
export function ApiGetAllEnquiries() {
  return applyDecorators(
    ApiOperation(EnquirySwaggerConstant.OPERATIONS.GET_ALL_ENQUIRIES),
    ApiQuery(EnquirySwaggerConstant.QUERY.PAGINATION.page),
    ApiQuery(EnquirySwaggerConstant.QUERY.PAGINATION.limit),
    SwaggerApiResponse(
      EnquirySwaggerConstant.RESPONSES.ENQUIRIES_LIST_RESPONSE,
    ),
    ApiUnauthorizedResponse(
      EnquirySwaggerConstant.ERRORS.UNAUTHORIZED.errorName,
      EnquirySwaggerConstant.ERRORS.UNAUTHORIZED.message,
    ),
    ApiForbiddenResponse(
      EnquirySwaggerConstant.ERRORS.FORBIDDEN.errorName,
      EnquirySwaggerConstant.ERRORS.FORBIDDEN.message,
    ),
    ApiServiceUnavailableResponse(
      EnquirySwaggerConstant.ERRORS.ENQUIRY_SERVICE_UNAVAILABLE.errorName,
      EnquirySwaggerConstant.ERRORS.ENQUIRY_SERVICE_UNAVAILABLE.message,
    ),
    ApiInternalErrorResponse(),
  );
}

/** Get enquiry by ID (admin only) */
export function ApiGetEnquiryById() {
  return applyDecorators(
    ApiOperation(EnquirySwaggerConstant.OPERATIONS.GET_ENQUIRY_BY_ID),
    ApiParam(EnquirySwaggerConstant.PARAMETERS.ENQUIRY_ID),
    SwaggerApiResponse(EnquirySwaggerConstant.RESPONSES.ENQUIRY_RESPONSE),
    ApiUnauthorizedResponse(
      EnquirySwaggerConstant.ERRORS.UNAUTHORIZED.errorName,
      EnquirySwaggerConstant.ERRORS.UNAUTHORIZED.message,
    ),
    ApiForbiddenResponse(
      EnquirySwaggerConstant.ERRORS.FORBIDDEN.errorName,
      EnquirySwaggerConstant.ERRORS.FORBIDDEN.message,
    ),
    ApiNotFoundResponse(
      EnquirySwaggerConstant.ERRORS.ENQUIRY_NOT_FOUND.errorName,
      EnquirySwaggerConstant.ERRORS.ENQUIRY_NOT_FOUND.message,
    ),
    ApiServiceUnavailableResponse(
      EnquirySwaggerConstant.ERRORS.ENQUIRY_SERVICE_UNAVAILABLE.errorName,
      EnquirySwaggerConstant.ERRORS.ENQUIRY_SERVICE_UNAVAILABLE.message,
    ),
    ApiInternalErrorResponse(),
  );
}

/** Get enquiries by property with pagination (admin/seller) */
export function ApiGetEnquiriesByProperty() {
  return applyDecorators(
    ApiOperation(EnquirySwaggerConstant.OPERATIONS.GET_ENQUIRIES_BY_PROPERTY),
    ApiParam(EnquirySwaggerConstant.PARAMETERS.PROPERTY_ID),
    ApiQuery(EnquirySwaggerConstant.QUERY.PAGINATION.page),
    ApiQuery(EnquirySwaggerConstant.QUERY.PAGINATION.limit),
    SwaggerApiResponse(
      EnquirySwaggerConstant.RESPONSES.ENQUIRIES_LIST_RESPONSE,
    ),
    ApiUnauthorizedResponse(
      EnquirySwaggerConstant.ERRORS.UNAUTHORIZED.errorName,
      EnquirySwaggerConstant.ERRORS.UNAUTHORIZED.message,
    ),
    ApiForbiddenResponse(
      EnquirySwaggerConstant.ERRORS.FORBIDDEN.errorName,
      EnquirySwaggerConstant.ERRORS.FORBIDDEN.message,
    ),
    ApiNotFoundResponse(
      EnquirySwaggerConstant.ERRORS.PROPERTY_NOT_FOUND.errorName,
      EnquirySwaggerConstant.ERRORS.PROPERTY_NOT_FOUND.message,
    ),
    ApiServiceUnavailableResponse(
      EnquirySwaggerConstant.ERRORS.ENQUIRY_SERVICE_UNAVAILABLE.errorName,
      EnquirySwaggerConstant.ERRORS.ENQUIRY_SERVICE_UNAVAILABLE.message,
    ),
    ApiInternalErrorResponse(),
  );
}

/** Update enquiry status (admin only) */
export function ApiUpdateEnquiryStatus() {
  return applyDecorators(
    ApiOperation(EnquirySwaggerConstant.OPERATIONS.UPDATE_ENQUIRY_STATUS),
    ApiParam(EnquirySwaggerConstant.PARAMETERS.ENQUIRY_ID),
    ApiBody({
      type: UpdateEnquiryStatusDto,
      examples: {
        default: {
          summary: 'Update Enquiry Status',
          value: EnquirySwaggerConstant.REQUESTS.UPDATE_STATUS,
        },
      },
    }),
    SwaggerApiResponse(EnquirySwaggerConstant.RESPONSES.UPDATE_STATUS_RESPONSE),
    ApiUnauthorizedResponse(
      EnquirySwaggerConstant.ERRORS.UNAUTHORIZED.errorName,
      EnquirySwaggerConstant.ERRORS.UNAUTHORIZED.message,
    ),
    ApiForbiddenResponse(
      EnquirySwaggerConstant.ERRORS.FORBIDDEN.errorName,
      EnquirySwaggerConstant.ERRORS.FORBIDDEN.message,
    ),
    ApiNotFoundResponse(
      EnquirySwaggerConstant.ERRORS.ENQUIRY_NOT_FOUND.errorName,
      EnquirySwaggerConstant.ERRORS.ENQUIRY_NOT_FOUND.message,
    ),
    ApiBadRequestResponse(
      EnquirySwaggerConstant.ERRORS.VALIDATION_ERROR.errorName,
      EnquirySwaggerConstant.ERRORS.VALIDATION_ERROR.message,
    ),
    ApiServiceUnavailableResponse(
      EnquirySwaggerConstant.ERRORS.ENQUIRY_SERVICE_UNAVAILABLE.errorName,
      EnquirySwaggerConstant.ERRORS.ENQUIRY_SERVICE_UNAVAILABLE.message,
    ),
    ApiInternalErrorResponse(),
  );
}

/** Create new enquiry (admin/seller/buyer) */
export function ApiCreateEnquiry() {
  return applyDecorators(
    ApiOperation(EnquirySwaggerConstant.OPERATIONS.CREATE_ENQUIRY),
    ApiBody({
      type: CreateEnquiryDto,
      examples: {
        default: {
          summary: 'Create Enquiry',
          value: EnquirySwaggerConstant.REQUESTS.CREATE_ENQUIRY,
        },
      },
    }),
    SwaggerApiResponse(
      EnquirySwaggerConstant.RESPONSES.CREATE_ENQUIRY_RESPONSE,
    ),
    ApiUnauthorizedResponse(
      EnquirySwaggerConstant.ERRORS.UNAUTHORIZED.errorName,
      EnquirySwaggerConstant.ERRORS.UNAUTHORIZED.message,
    ),
    ApiForbiddenResponse(
      EnquirySwaggerConstant.ERRORS.FORBIDDEN.errorName,
      EnquirySwaggerConstant.ERRORS.FORBIDDEN.message,
    ),
    ApiBadRequestResponse(
      EnquirySwaggerConstant.ERRORS.VALIDATION_ERROR.errorName,
      EnquirySwaggerConstant.ERRORS.VALIDATION_ERROR.message,
    ),
    ApiServiceUnavailableResponse(
      EnquirySwaggerConstant.ERRORS.ENQUIRY_SERVICE_UNAVAILABLE.errorName,
      EnquirySwaggerConstant.ERRORS.ENQUIRY_SERVICE_UNAVAILABLE.message,
    ),
    ApiInternalErrorResponse(),
  );
}
