import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse as SwaggerApiResponse,
  ApiBody,
} from '@nestjs/swagger';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiInternalErrorResponse,
  ApiServiceUnavailableResponse,
  ApiUnauthorizedResponse,
} from '../../../common/decorators/swagger-error.decorator';
import { AuthSwaggerConstant } from '../constants/auth-swagger.constant';
import { LoginUserDto } from '../dtos/login.dto';
import { CreateUserDto } from '../dtos/create-user.dto';

/**
 * Auth Swagger Decorators
 */

/** User login with cookie */
export function SwaggerApiLogin() {
  return applyDecorators(
    ApiOperation(AuthSwaggerConstant.OPERATIONS.LOGIN),
    ApiBody({ type: LoginUserDto }),
    SwaggerApiResponse(AuthSwaggerConstant.RESPONSES.LOGIN_RESPONSE),
    ApiBadRequestResponse(
      AuthSwaggerConstant.ERRORS.VALIDATION_ERROR.errorName,
      AuthSwaggerConstant.ERRORS.VALIDATION_ERROR.message,
    ),
    ApiUnauthorizedResponse(
      AuthSwaggerConstant.ERRORS.INVALID_CREDENTIALS.errorName,
      AuthSwaggerConstant.ERRORS.INVALID_CREDENTIALS.message,
    ),
    ApiServiceUnavailableResponse(
      AuthSwaggerConstant.ERRORS.AUTH_SERVICE_UNAVAILABLE.errorName,
      AuthSwaggerConstant.ERRORS.AUTH_SERVICE_UNAVAILABLE.message,
    ),
    ApiInternalErrorResponse(),
  );
}

/** User registration */
export function SwaggerApiRegister() {
  return applyDecorators(
    ApiOperation(AuthSwaggerConstant.OPERATIONS.REGISTER),
    ApiBody({ type: CreateUserDto }),
    SwaggerApiResponse(AuthSwaggerConstant.RESPONSES.REGISTER_RESPONSE),
    ApiBadRequestResponse(
      AuthSwaggerConstant.ERRORS.VALIDATION_ERROR.errorName,
      'Email must be valid',
    ),
    ApiConflictResponse(
      AuthSwaggerConstant.ERRORS.USER_ALREADY_EXISTS.errorName,
      AuthSwaggerConstant.ERRORS.USER_ALREADY_EXISTS.message,
    ),
    ApiServiceUnavailableResponse(
      AuthSwaggerConstant.ERRORS.AUTH_SERVICE_UNAVAILABLE.errorName,
      AuthSwaggerConstant.ERRORS.AUTH_SERVICE_UNAVAILABLE.message,
    ),
    ApiInternalErrorResponse(),
  );
}

/** User logout */
export function SwaggerApiLogout() {
  return applyDecorators(
    ApiOperation(AuthSwaggerConstant.OPERATIONS.LOGOUT),
    SwaggerApiResponse(AuthSwaggerConstant.RESPONSES.LOGOUT_RESPONSE),
    ApiServiceUnavailableResponse(
      AuthSwaggerConstant.ERRORS.AUTH_SERVICE_UNAVAILABLE.errorName,
      AuthSwaggerConstant.ERRORS.AUTH_SERVICE_UNAVAILABLE.message,
    ),
    ApiInternalErrorResponse(),
  );
}

/** Get current authenticated user */
export function SwaggerApiMe() {
  return applyDecorators(
    ApiOperation(AuthSwaggerConstant.OPERATIONS.ME),
    SwaggerApiResponse(AuthSwaggerConstant.RESPONSES.ME_RESPONSE),
    ApiUnauthorizedResponse(
      AuthSwaggerConstant.ERRORS.INVALID_CREDENTIALS.errorName,
      AuthSwaggerConstant.ERRORS.INVALID_CREDENTIALS.message,
    ),
    ApiServiceUnavailableResponse(
      AuthSwaggerConstant.ERRORS.AUTH_SERVICE_UNAVAILABLE.errorName,
      AuthSwaggerConstant.ERRORS.AUTH_SERVICE_UNAVAILABLE.message,
    ),
    ApiInternalErrorResponse(),
  );
}
