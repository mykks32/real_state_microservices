import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AppConfigService } from '../../config/config.service';
import { HttpService } from '@nestjs/axios';
import { IApiResponse } from '../../common/interfaces/api-response.interface';
import { CreateEnquiryDto } from './dtos/create-enquiry.dto';
import { IEnquiry } from './interfaces/enquiry.interface';
import { JwtGatewayGuard } from '../../common/guards/jwt.guard';
import { firstValueFrom } from 'rxjs';
import { PaginationQueryDto } from './dtos/pagination-query.dto';
import { UpdateEnquiryStatusDto } from './dtos/update-enquiry-status.dto';
import { RequestWithUserContext } from '../../common/types/request-with-context.type';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';

/**
 * EnquiryController
 *
 * Handles enquiry-related API endpoints.
 * Forwards requests and manages pagination, property filtering, status updates, and creation.
 *
 * Routes:
 * - GET /enquiries/all?page={page}&limit={limit} - Get paginated enquiries.
 * - GET /enquiry/:enquiry_id - Get enquiry by ID.
 * - GET /enquiry/property/:property_id?page={page}&limit={limit} - Get paginated enquiries by property.
 *   Example: `/enquiry/property/123e4567-e89b-12d3-a456-426614174000?page=2&limit=2`
 * - PATCH /enquiry/:enquiry_id/status - Update enquiry status.
 * - POST /enquiry - Create a new enquiry.
 *
 * Uses HttpService for communication and logs requests.
 * Stateless, no direct business logic here.
 */
@Controller('enquiry')
export class EnquiryController {
  /** Logger instance scoped to EnquiryController. */
  private readonly logger = new Logger(EnquiryController.name);

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
   * Create enquiry URL built from the enquiry service base URL.
   *
   * @readonly
   * @type {string}
   */
  private get createEnquiryUrl(): string {
    return `${this.configService.enquiryServiceUrl}/enquiry`;
  }

  /**
   * Create enquiry URL built from the enquiry service base URL.
   *
   * @readonly
   * @type {string}
   */
  private getEnquiryByIdUrl(id: string): string {
    return `${this.configService.enquiryServiceUrl}/enquiry/${id}`;
  }

  /**
   * Get all the enquiry
   *
   * @private
   * @param {number} page
   * @param {number} limit
   * @returns {string}
   */
  private getAllEnquiryUrl(page?: number, limit?: number): string {
    return `${this.configService.enquiryServiceUrl}/enquiry/all?page=${page}&limit=${limit}`;
  }

  /**
   * Get Enquiries by propertyId
   *
   * @private
   * @param {string} propertyId
   * @param {number} page
   * @param {number} limit
   * @returns {string}
   */
  private getEnquiryByPropertyId(
    propertyId: string,
    page?: number,
    limit?: number,
  ): string {
    return `${this.configService.enquiryServiceUrl}/enquiry/property/${propertyId}?page=${page}&limit=${limit}`;
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
   * Fetches all enquiries with pagination.
   *
   * @route GET /enquiry/all
   * @param {Request} req
   * @param query
   * @returns {Promise<IApiResponse<IEnquiry[]>>} Paginated list of enquiries.
   *
   * @remarks
   * Supports query params: `page`, `limit`.
   * Logs request info.
   *
   */
  @Get('/all')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGatewayGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async getEnquiries(
    @Req() req: Request,
    @Query() query: PaginationQueryDto,
  ): Promise<IApiResponse<IEnquiry[]>> {
    const requestId = req.headers['x-request-id'] as string;

    this.logger.log(`Fetching Enquiries | request_id=${requestId}`);

    const { page, limit } = query;

    const response = await firstValueFrom(
      this.httpService.get<IApiResponse<IEnquiry[]>>(
        this.getAllEnquiryUrl(page, limit),
        {
          headers: {
            'x-request-id': requestId,
          },
        },
      ),
    );

    this.logger.log(`Enquiry fetched successfully | request_id=${requestId}`);

    return response.data;
  }

  /**
   * Retrieves a single enquiry by its ID.
   *
   * @route GET /enquiry/:enquiryId
   * @param {string} enquiryId - Enquiry unique identifier.
   * @param {Request} req - Express request object containing headers (e.g. x-request-id).
   * @returns {Promise<IApiResponse<IEnquiry>>} Enquiry details.
   *
   * @remarks
   * Propagates x-request-id for traceability across services.
   * Logs both request initiation and success.
   */
  @Get('/:enquiryId')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGatewayGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async getEnquiryById(
    @Param('enquiryId') enquiryId: string,
    @Req() req: Request,
  ): Promise<IApiResponse<IEnquiry>> {
    const requestId = req.headers['x-request-id'] as string;

    this.logger.log(
      `Fetching enquiry | enquiry_id=${enquiryId} | request_id=${requestId}`,
    );

    const response = await firstValueFrom(
      this.httpService.get<IApiResponse<IEnquiry>>(
        this.getEnquiryByIdUrl(enquiryId),
        {
          headers: {
            'x-request-id': requestId,
          },
        },
      ),
    );

    this.logger.log(
      `Enquiry fetched successfully | enquiry_id=${enquiryId} | request_id=${requestId}`,
    );

    return response.data;
  }

  /**
   * Fetches enquiries filtered by property ID with pagination.
   *
   * @route GET /enquiry/property/:property_id
   * @param {string} propertyId
   * @param {Request} req
   * @param {PaginationQueryInterface} query
   * @returns {Promise<IApiResponse<IEnquiry>>} Paginated enquiries for the property.
   *
   * @remarks
   * Supports query params: `page`, `limit`.
   */
  @Get('/property/:propertyId')
  @UseGuards(JwtGatewayGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SELLER)
  async getEnquiriesByProperty(
    @Param('propertyId') propertyId: string,
    @Req() req: Request,
    @Query() query: PaginationQueryDto,
  ): Promise<IApiResponse<IEnquiry[]>> {
    const requestId = req.headers['x-request-id'] as string;

    this.logger.log(
      `Fetching Enquiry | property_id= ${propertyId} | request_id = ${requestId}`,
    );

    const { page, limit } = query;

    const response = await firstValueFrom(
      this.httpService.get<IApiResponse<IEnquiry[]>>(
        this.getEnquiryByPropertyId(propertyId, page, limit),
        {
          headers: {
            'x-request-id': requestId,
          },
        },
      ),
    );

    this.logger.log(
      `Enquiry fetched successfully | property_id=${propertyId} | request_id=${requestId}`,
    );

    return response.data;
  }

  /**
   * Updates the status of an enquiry.
   *
   * @route PATCH /enquiry/:enquiry_id/status
   * @returns {Promise<IApiResponse<IEnquiry>>} Updated enquiry.
   *
   * @remarks
   * Validates and logs status update.
   * @param enquiryId
   * @param dto
   * @param req
   */
  @Patch('/:enquiryId/status')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGatewayGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async changeEnquiryStatus(
    @Param('enquiryId') enquiryId: string,
    @Body() dto: UpdateEnquiryStatusDto,
    @Req() req: Request,
  ): Promise<IApiResponse<IEnquiry>> {
    const requestId = req.headers['x-request-id'] as string;

    this.logger.log(
      `Changing Enquiry Status | enquiryId= ${enquiryId} | request_id = ${requestId}`,
    );

    const response = await firstValueFrom(
      this.httpService.patch<IApiResponse<IEnquiry>>(
        this.changeEnquiryStatusByEnquiryId(enquiryId),
        dto,
        {
          headers: {
            'x-request-id': requestId,
          },
        },
      ),
    );

    this.logger.log(
      `Successfully Changed Enquiry Status | enquiryId= ${enquiryId} | request_id = ${requestId}`,
    );

    return response.data;
  }

  /**
   * Creates a new enquiry.
   *
   * @route POST /enquiry
   *
   * Requires authentication (JWT).
   * Adds user ID from JWT to DTO.
   * Forwards the request to the downstream service.
   * @param {RequestWithUserContext} req
   * @param {CreateEnquiryDto} requestCreateEnquiryDto
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtGatewayGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SELLER, Role.BUYER)
  async createEnquiry(
    @Req() req: RequestWithUserContext,
    @Body() requestCreateEnquiryDto: CreateEnquiryDto,
  ): Promise<IApiResponse<IEnquiry>> {
    const userId = req.user.id;
    const requestId = req.headers['x-request-id'] as string;

    const payload: CreateEnquiryDto = {
      ...requestCreateEnquiryDto,
      user_id: userId,
    };

    this.logger.log(
      `Enquiry creation started | property_id=${payload.property_id} | user_id=${userId} | request_id=${requestId}`,
    );

    const response = await firstValueFrom(
      this.httpService.post<IApiResponse<IEnquiry>>(
        this.createEnquiryUrl,
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
      `Enquiry created successfully | user_id=${userId} | request_id=${requestId}`,
    );

    return response.data;
  }
}
