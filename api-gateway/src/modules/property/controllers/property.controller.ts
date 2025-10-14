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

/**
 * PropertyController
 *
 * Handles property-related API endpoints.
 *
 * Routes:
 * - GET /property/approved - Get all approved property.
 * - GET /id/:propertyId - Get property by ID.
 *
 * Uses HttpService for communication and logs requests.
 * Stateless, no direct business logic here.
 */
@Controller('property')
export class PropertyController {
  /** Logger instance scoped to EnquiryController. */
  private readonly logger = new Logger(PropertyController.name);

  /**
   * Constructs the controller with required dependencies.
   *
   * @param {PropertyUrlBuilder} propertyUrlBuilder
   * @param {HttpService} httpService - Used to send HTTP requests to downstream services.
   */
  constructor(
    private readonly propertyUrlBuilder: PropertyUrlBuilder,
    private readonly httpService: HttpService,
  ) {}

  /**
   * Fetches property by propertyId.
   *
   * @route GET /id/:propertyId
   * @param {Request} req
   * @param {string} propertyId
   * @returns {Promise<IApiResponse<IProperty>>} Paginated enquiries for the property.
   *
   * @remarks
   * Forwards the request to the downstream service.
   */
  @Get('/id/:propertyId')
  @HttpCode(HttpStatus.OK)
  async getPropertyById(
    @Req() req: Request,
    @Param('propertyId') propertyId: string,
    // @Query() query: PaginationQueryDto,
  ): Promise<IApiResponse<IProperty>> {
    const requestId = req.headers['x-request-id'] as string;

    this.logger.log(
      `Fetching Property by propertyId | propertyId: ${propertyId} | request_id = ${requestId}`,
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
      `Property fetched successfully | propertyId: ${propertyId} | request_id=${requestId}`,
    );

    return response.data;
  }

  /**
   * Fetches approved property.
   *
   * @route GET /approved
   * @param {Request} req
   * @returns {Promise<IApiResponse<IProperty[]>>}
   *
   * @remarks
   * Forwards the request to the downstream service.
   */
  @Get('/approved')
  @HttpCode(HttpStatus.OK)
  async getApprovedProperty(
    @Req() req: Request,
    // @Query() query: PaginationQueryDto,
  ): Promise<IApiResponse<IProperty[]>> {
    const requestId = req.headers['x-request-id'] as string;

    this.logger.log(`Fetching Approved Property | request_id = ${requestId}`);

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

    this.logger.log(
      `Approved Property fetched successfully  | request_id=${requestId}`,
    );

    return response.data;
  }
}
