import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  Patch,
  Post,
  Put,
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
import { UpdatePropertyDTO } from './dtos/update-property.dto';

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
   * Update property URL built from the property service base URL.
   * @param {string} propertyId
   *
   * @returns string
   */
  private updatePropertyUrl(propertyId: string): string {
    return `${this.configService.propertyServiceUrl}/properties/${propertyId}`;
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
   * Fetch pending properties
   *
   * @readonly
   * @type {string}
   */
  private get pendingPropertyUrl(): string {
    return `${this.configService.propertyServiceUrl}/properties/pending`;
  }

  /**
   * Fetch approved properties
   *
   * @readonly
   * @type {string}
   */
  private get approvedPropertyUrl(): string {
    return `${this.configService.propertyServiceUrl}/properties/approved`;
  }

  /**
   * Submit property approval URL
   *
   * @private
   * @param {string} propertyId
   * @returns {string}
   */
  private submitPropertyApprovalUrl(propertyId: string): string {
    return `${this.configService.propertyServiceUrl}/properties/${propertyId}/submit`;
  }

  /**
   * Approve property URL
   *
   * @private
   * @param {string} propertyId
   * @returns {string}
   */
  private approvePropertyUrl(propertyId: string): string {
    return `${this.configService.propertyServiceUrl}/properties/${propertyId}/approve`;
  }

  /**
   * Reject property URL
   *
   * @private
   * @param {string} propertyId
   * @returns {string}
   */
  private rejectPropertyUrl(propertyId: string): string {
    return `${this.configService.propertyServiceUrl}/properties/${propertyId}/reject`;
  }

  /**
   * Archive property URL
   *
   * @private
   * @param {string} propertyId
   * @returns {string}
   */
  private archivePropertyUrl(propertyId: string): string {
    return `${this.configService.propertyServiceUrl}/properties/${propertyId}/archive`;
  }

  /**
   * Delete property URL
   *
   * @private
   * @param {string} propertyId
   * @returns {string}
   */
  private deletePropertyUrl(propertyId: string): string {
    return `${this.configService.propertyServiceUrl}/properties/delete/${propertyId}`;
  }

  /**
   * Creates a new property.
   *
   * @route POST /properties
   * @param {RequestWithUser} req
   * @param {RequestCreatePropertyDTO} requestCreatePropertyDto
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
    @Body() requestCreatePropertyDto: RequestCreatePropertyDTO,
  ): Promise<IApiResponse<IProperty>> {
    const userId = req.user.id;
    const requestId = req.headers['x-request-id'] as string;

    const payload: CreatePropertyDTO = {
      ...requestCreatePropertyDto,
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

  /**
   * Fetches pending property.
   *
   * @route GET /pending
   * @param {Request} req
   * @returns {Promise<IApiResponse<IProperty[]>>}
   *
   * @remarks
   * Forwards the request to the downstream service.
   */
  @Get('/pending')
  @HttpCode(HttpStatus.OK)
  async getPendingProperty(
    @Req() req: Request,
    // @Query() query: PaginationQueryDto,
  ): Promise<IApiResponse<IProperty[]>> {
    const requestId = req.headers['x-request-id'] as string;

    this.logger.log(`Fetching Pending Property | request_id = ${requestId}`);

    const response = await firstValueFrom(
      this.httpService.get<IApiResponse<IProperty[]>>(this.pendingPropertyUrl, {
        headers: {
          'x-request-id': requestId,
        },
      }),
    );

    this.logger.log(
      `Pending Property fetched successfully  | request_id=${requestId}`,
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
        this.approvedPropertyUrl,
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

  /**
   * Submit for approval.
   *
   * @route PATCH /:propertyId/submit
   * @param {Request} req
   * @param propertyId
   * @returns {Promise<IApiResponse<IProperty>>}
   *
   * @remarks
   * Forwards the request to the downstream service.
   */
  @Patch('/:propertyId/submit')
  @HttpCode(HttpStatus.OK)
  async submitForPropertyApproval(
    @Req() req: Request,
    @Param('propertyId') propertyId: string,
  ): Promise<IApiResponse<{ approval: boolean; message: string }>> {
    const requestId = req.headers['x-request-id'] as string;

    this.logger.log(
      `Submitting for Property Approval | request_id = ${requestId}`,
    );

    const response = await firstValueFrom(
      this.httpService.patch<
        IApiResponse<{ approval: boolean; message: string }>
      >(
        this.submitPropertyApprovalUrl(propertyId),
        {},
        {
          headers: {
            'x-request-id': requestId,
          },
        },
      ),
    );

    this.logger.log(
      `Submit property Approval successfully  | request_id=${requestId}`,
    );

    return response.data;
  }

  /**
   * Property Approved.
   *
   * @route PATCH /:propertyId/approve
   * @param {Request} req
   * @param propertyId
   * @returns {Promise<IApiResponse<{ approval: boolean; message: string }>>}
   *
   * @remarks
   * Forwards the request to the downstream service.
   */
  @Patch('/:propertyId/approve')
  @HttpCode(HttpStatus.OK)
  async approveProperty(
    @Req() req: Request,
    @Param('propertyId') propertyId: string,
  ): Promise<IApiResponse<{ approval: boolean; message: string }>> {
    const requestId = req.headers['x-request-id'] as string;

    this.logger.log(
      `Approve property | propertyId: ${propertyId} | request_id = ${requestId}`,
    );

    const response = await firstValueFrom(
      this.httpService.patch<
        IApiResponse<{ approval: boolean; message: string }>
      >(
        this.approvePropertyUrl(propertyId),
        {},
        {
          headers: {
            'x-request-id': requestId,
          },
        },
      ),
    );

    this.logger.log(
      `Property Approve successfully | propertyId: ${propertyId}  | request_id=${requestId}`,
    );

    return response.data;
  }

  /**
   * Property Rejected.
   *
   * @route PATCH /:propertyId/reject
   * @param {Request} req
   * @param propertyId
   * @returns {Promise<IApiResponse<{ approval: boolean; message: string }>>}
   *
   * @remarks
   * Forwards the request to the downstream service.
   */
  @Patch('/:propertyId/reject')
  @HttpCode(HttpStatus.OK)
  async rejectProperty(
    @Req() req: Request,
    @Param('propertyId') propertyId: string,
  ): Promise<IApiResponse<{ approval: boolean; message: string }>> {
    const requestId = req.headers['x-request-id'] as string;

    this.logger.log(
      `Reject property | propertyId: ${propertyId} | request_id = ${requestId}`,
    );

    const response = await firstValueFrom(
      this.httpService.patch<
        IApiResponse<{ approval: boolean; message: string }>
      >(
        this.rejectPropertyUrl(propertyId),
        {},
        {
          headers: {
            'x-request-id': requestId,
          },
        },
      ),
    );

    this.logger.log(
      `Property Rejected successfully | propertyId: ${propertyId}  | request_id=${requestId}`,
    );

    return response.data;
  }

  /**
   * Archive Property.
   *
   * @route PATCH /:propertyId/archive
   * @param {Request} req
   * @param propertyId
   * @returns {Promise<IApiResponse<{ approval: boolean; message: string }>>}
   *
   * @remarks
   * Forwards the request to the downstream service.
   */
  @Patch('/:propertyId/archive')
  @HttpCode(HttpStatus.OK)
  async archiveProperty(
    @Req() req: Request,
    @Param('propertyId') propertyId: string,
  ): Promise<IApiResponse<{ approval: boolean; message: string }>> {
    const requestId = req.headers['x-request-id'] as string;

    this.logger.log(
      `Archived property | propertyId: ${propertyId} | request_id = ${requestId}`,
    );

    const response = await firstValueFrom(
      this.httpService.patch<
        IApiResponse<{ approval: boolean; message: string }>
      >(
        this.archivePropertyUrl(propertyId),
        {},
        {
          headers: {
            'x-request-id': requestId,
          },
        },
      ),
    );

    this.logger.log(
      `Property Archived successfully | propertyId: ${propertyId}  | request_id=${requestId}`,
    );

    return response.data;
  }

  /**
   * Delete Property.
   *
   * @route DELETE /delete/:propertyId
   * @param {Request} req
   * @param propertyId
   * @returns {Promise<IApiResponse<{ approval: boolean; message: string }>>}
   *
   * @remarks
   * Forwards the request to the downstream service.
   */
  @Delete('/delete/:propertyId')
  @HttpCode(HttpStatus.OK)
  async deleteProperty(
    @Req() req: Request,
    @Param('propertyId') propertyId: string,
  ): Promise<IApiResponse<boolean>> {
    const requestId = req.headers['x-request-id'] as string;

    this.logger.log(
      `Deleting property | propertyId: ${propertyId} | request_id = ${requestId}`,
    );

    const response = await firstValueFrom(
      this.httpService.delete<IApiResponse<boolean>>(
        this.deletePropertyUrl(propertyId),
        {
          headers: {
            'x-request-id': requestId,
          },
        },
      ),
    );

    this.logger.log(
      `Property deleted successfully | propertyId: ${propertyId}  | request_id=${requestId}`,
    );

    return response.data;
  }

  /**
   * Update property info.
   *
   * @route PUT /property_id
   * @param {RequestWithUser} req
   * @param propertyId
   * @param {UpdatePropertyDTO} updatePropertyDTO
   *
   * @remarks
   * Requires authentication (JWT).
   * Adds user ID from JWT to DTO.
   * Forwards the request to the downstream service.
   */
  @Put('/:propertyId')
  @HttpCode(HttpStatus.OK)
  async updateProperty(
    @Req() req: Request,
    @Param('propertyId') propertyId: string,
    @Body() updatePropertyDTO: UpdatePropertyDTO,
  ): Promise<IApiResponse<IProperty>> {
    const requestId = req.headers['x-request-id'] as string;

    this.logger.log(`Updating Property started | request_id=${requestId}`);

    const response = await firstValueFrom(
      this.httpService.put<IApiResponse<IProperty>>(
        this.updatePropertyUrl(propertyId),
        updatePropertyDTO,
        {
          headers: {
            'x-request-id': requestId,
            'Content-Type': 'application/json',
          },
        },
      ),
    );

    this.logger.log(`Property updated successfully | request_id=${requestId}`);

    return response.data;
  }
}
