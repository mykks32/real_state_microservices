import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  Req,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { IApiResponse } from '../../../common/interfaces/api-response.interface';
import { firstValueFrom } from 'rxjs';
import { IProperty } from '../interfaces/property.interface';
import { PropertyUrlBuilder } from '../utils/property-url.builder';
import { ApiTags } from '@nestjs/swagger';
import {
  ApiGetApprovedProperties,
  ApiGetPropertyById,
} from '../decorators/buyer-property-swagger.decorator';
import { BuyerPropertySwaggerConstant } from '../constants/buyer-swagger.constant';

/**
 * PropertyController
 *
 * Handles property-related API endpoints by forwarding requests
 * to the downstream property-service and normalizing responses.
 *
 * Routes:
 * - GET /property/approved - Get all approved properties
 * - GET /property/id/:propertyId - Get property by ID
 *
 * Uses HttpService for communication and logs requests.
 * Stateless, no business logic implemented here.
 */
@Controller('property')
@ApiTags(BuyerPropertySwaggerConstant.TAGS.BUYER_PROPERTY)
export class PropertyController {
  /** Logger instance scoped to PropertyController. */
  private readonly logger = new Logger(PropertyController.name);

  /**
   * Constructs the controller with required dependencies.
   *
   * @param {PropertyUrlBuilder} propertyUrlBuilder - Builds URLs for property service endpoints
   * @param {HttpService} httpService - Used to send HTTP requests to downstream services.
   */
  constructor(
    private readonly propertyUrlBuilder: PropertyUrlBuilder,
    private readonly httpService: HttpService,
  ) {}

  /**
   * Fetches property by propertyId.
   *
   * @route GET /property/id/:propertyId
   * @status 200 - OK
   *
   * @param {Request} req - Incoming HTTP request
   * @param {string} propertyId - UUID of the property to fetch
   * @returns {Promise<IApiResponse<IProperty>>} Standardized response containing property data
   *
   * @remarks
   * - Forwards request to property service
   * - Returns complete property details including location information
   * - Handles both active and inactive properties
   */
  @Get('/id/:propertyId')
  @HttpCode(HttpStatus.OK)
  @ApiGetPropertyById()
  async getPropertyById(
    @Req() req: Request,
    @Param('propertyId') propertyId: string,
  ): Promise<IApiResponse<IProperty>> {
    const requestId = req.headers['x-request-id'] as string;

    this.logger.log(
      `[${requestId}] Fetching Property by propertyId | propertyId: ${propertyId}`,
    );

    const response = await firstValueFrom(
      this.httpService.get<IApiResponse<IProperty>>(
        this.propertyUrlBuilder.getPropertyByPropertyId(propertyId),
        {
          headers: {
            'x-request-id': requestId,
          },
        },
      ),
    );

    this.logger.log(
      `[${requestId}] Property fetched successfully | propertyId: ${propertyId}`,
    );

    return response.data;
  }

  /**
   * Fetches all approved properties.
   *
   * @route GET /property/approved
   * @status 200 - OK
   *
   * @param {Request} req - Incoming HTTP request
   * @returns {Promise<IApiResponse<IProperty[]>>} Standardized response containing array of approved properties
   *
   * @remarks
   * - Returns only properties with APPROVED status
   * - Includes pagination support (to be implemented)
   * - Suitable for public property listings
   */
  @Get('/approved')
  @HttpCode(HttpStatus.OK)
  @ApiGetApprovedProperties()
  async getApprovedProperty(
    @Req() req: Request,
  ): Promise<IApiResponse<IProperty[]>> {
    const requestId = req.headers['x-request-id'] as string;

    this.logger.log(`[${requestId}] Fetching Approved Properties`);

    const response = await firstValueFrom(
      this.httpService.get<IApiResponse<IProperty[]>>(
        this.propertyUrlBuilder.approvedPropertyUrl,
        {
          headers: {
            'x-request-id': requestId,
          },
        },
      ),
    );

    this.logger.log(`[${requestId}] Approved Properties fetched successfully`);

    return response.data;
  }
}
