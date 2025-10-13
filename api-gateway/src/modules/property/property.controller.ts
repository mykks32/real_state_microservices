import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AppConfigService } from '../../config/config.service';
import { HttpService } from '@nestjs/axios';
import {
  JwtGatewayGuard,
  RequestWithUser,
} from '../../common/guards/jwt.guard';
import { IApiResponse } from '../../common/interfaces/api-response.interface';
import { firstValueFrom } from 'rxjs';
import { RequestCreatePropertyDTO } from './dtos/request-create-property.dto';
import { CreatePropertyDTO } from './dtos/create-property.dto';
import { IProperty } from './interfaces/property.interface';

@Controller('property')
export class PropertyController {
  /** Logger instance scoped to EnquiryController. */
  private readonly logger = new Logger(PropertyController.name);

  /**
   * Constructs the controller with required dependencies.
   *
   * @param {AppConfigService} configService - Service to access application configuration.
   * @param {HttpService} httpService - Used to send HTTP requests to downstream services.
   */
  constructor(
    private readonly configService: AppConfigService,
    private readonly httpService: HttpService,
  ) {}

  /**
   * Create property URL built from the property service base URL.
   *
   * @readonly
   * @type {string}
   */
  private get createPropertyUrl(): string {
    return `${this.configService.propertyServiceUrl}/properties`;
  }

  /**
   * Get property by owner id url.
   *
   * @readonly
   * @type {string}
   */
  private getPropertyByOwnerIdUrl(ownerId: string): string {
    return `${this.configService.propertyServiceUrl}/properties/owner/${ownerId}`;
  }

  /**
   * Get All properties.
   *
   * @readonly
   * @type {string}
   */
  private getAllPropertyUrl(): string {
    return `${this.configService.propertyServiceUrl}/properties`;
  }

  /**
   * Get property by propertyId
   *
   * @private
   * @param {string} propertyId
   * @returns {string}
   */
  private getPropertyByPropertyId(propertyId: string): string {
    return `${this.configService.propertyServiceUrl}/properties/${propertyId}`;
  }

  /**
   * Change Enquiry status by enquiryId
   *
   * @private
   * @param {string} enquiryId
   * @returns {string}
   */
  private changeEnquiryStatusByEnquiryId(enquiryId: string): string {
    return `${this.configService.enquiryServiceUrl}/enquiry/${enquiryId}/status`;
  }

  /**
   * Creates a new property.
   *
   * @route POST /properties
   * @param {RequestWithUser} req
   * @param {RequestCreatePropertyDTO} requestCreateEnquiryDto
   *
   * @remarks
   * Requires authentication (JWT).
   * Adds user ID from JWT to DTO.
   * Forwards the request to the downstream service.
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtGatewayGuard)
  async createProperty(
    @Req() req: RequestWithUser,
    @Body() requestCreateEnquiryDto: RequestCreatePropertyDTO,
  ): Promise<IApiResponse<IProperty>> {
    const userId = req.user.id;
    const requestId = req.headers['x-request-id'] as string;

    const payload: CreatePropertyDTO = {
      ...requestCreateEnquiryDto,
      ownerId: userId,
    };

    this.logger.log(
      `Property creation started | property title=${payload.title} | user_id=${userId} | request_id=${requestId}`,
    );

    const response = await firstValueFrom(
      this.httpService.post<IApiResponse<IProperty>>(
        this.createPropertyUrl,
        payload,
        {
          headers: {
            'x-request-id': requestId,
            'Content-Type': 'application/json',
          },
        },
      ),
    );

    this.logger.log(
      `Property created successfully | user_id=${userId} | request_id=${requestId}`,
    );

    return response.data;
  }

  /**
   * Fetches property filtered by owner ID.
   *
   * @route GET /property/ownerId
   * @param {RequestWithUser} req
   * @returns {Promise<IApiResponse<IProperty[]>>} Paginated enquiries for the property.
   *
   * @remarks
   * Requires authentication (JWT).
   * Adds user ID from JWT to DTO.
   * Forwards the request to the downstream service.
   */
  @Get('/owner')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGatewayGuard)
  async getPropertyByOwnerId(
    @Req() req: RequestWithUser,
    // @Query() query: PaginationQueryDto,
  ): Promise<IApiResponse<IProperty[]>> {
    const requestId = req.headers['x-request-id'] as string;

    const ownerId = req.user.id;

    this.logger.log(
      `Fetching Properties | ownerId= ${ownerId} | request_id = ${requestId}`,
    );

    const response = await firstValueFrom(
      this.httpService.get<IApiResponse<IProperty[]>>(
        this.getPropertyByOwnerIdUrl(ownerId),
        {
          headers: {
            'x-request-id': requestId,
          },
        },
      ),
    );

    this.logger.log(
      `Property fetched successfully | ownerId=${ownerId} | request_id=${requestId}`,
    );

    return response.data;
  }

  /**
   * Fetches All properties.
   *
   * @route GET /property
   * @param {RequestWithUser} req
   * @returns {Promise<IApiResponse<IProperty[]>>} Paginated enquiries for the property.
   *
   * @remarks
   * Forwards the request to the downstream service.
   */
  @Get('/all')
  @HttpCode(HttpStatus.OK)
  async getAllProperty(
    @Req() req: RequestWithUser,
    // @Query() query: PaginationQueryDto,
  ): Promise<IApiResponse<IProperty[]>> {
    const requestId = req.headers['x-request-id'] as string;

    this.logger.log(`Fetching All Properties | request_id = ${requestId}`);

    const response = await firstValueFrom(
      this.httpService.get<IApiResponse<IProperty[]>>(
        this.getAllPropertyUrl(),
        {
          headers: {
            'x-request-id': requestId,
          },
        },
      ),
    );

    this.logger.log(`Property fetched successfully | request_id=${requestId}`);

    return response.data;
  }

  /**
   * Fetches property by propertyId.
   *
   * @route GET /:propertyId
   * @param {Request} req
   * @param {string} propertyId
   * @returns {Promise<IApiResponse<IProperty>>} Paginated enquiries for the property.
   *
   * @remarks
   * Forwards the request to the downstream service.
   */
  @Get('/:propertyId')
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
        this.getPropertyByPropertyId(propertyId),
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
}
