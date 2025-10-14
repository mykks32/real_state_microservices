import { RequestWithUserContext } from '../../../common/types/request-with-context.type';
import { PropertyUrlBuilder } from '../utils/property-url.builder';
import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { IApiResponse } from '../../../common/interfaces/api-response.interface';
import { IProperty } from '../interfaces/property.interface';
import { firstValueFrom } from 'rxjs';
import { JwtGatewayGuard } from '../../../common/guards/jwt.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { Role } from '../../../common/enums/role.enum';

/**
 * AdminPropertyController
 *
 * Handles admin-only property-related API endpoints.
 *
 * All routes require:
 * - JWT authentication
 * - ADMIN role
 *
 * Routes:
 * - GET    /property/all                  → Get all properties
 * - GET    /property/pending              → Get all pending properties
 * - PATCH  /property/:propertyId/approve  → Approve a property
 * - PATCH  /property/:propertyId/reject   → Reject a property
 * - PATCH  /property/:propertyId/archive  → Archive a property
 * - DELETE /property/delete/:propertyId   → Delete a property
 */
@Controller('property')
@UseGuards(JwtGatewayGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AdminPropertyController {
  /** Logger instance scoped to AdminPropertyController. */
  private readonly logger = new Logger(AdminPropertyController.name);

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
   * Fetches All properties.
   *
   * @route GET /property
   * @param {RequestWithUserContext} req
   * @returns {Promise<IApiResponse<IProperty[]>>} Paginated enquiries for the property.
   *
   * @remarks
   * Forwards the request to the downstream service.
   */
  @Get('/all')
  @HttpCode(HttpStatus.OK)
  async getAllProperty(
    @Req() req: RequestWithUserContext,
    // @Query() query: PaginationQueryDto,
  ): Promise<IApiResponse<IProperty[]>> {
    const requestId = req.headers['x-request-id'] as string;

    this.logger.log(`Fetching All Properties | request_id = ${requestId}`);

    const response = await firstValueFrom(
      this.httpService.get<IApiResponse<IProperty[]>>(
        this.propertyUrlBuilder.getAllPropertyUrl(),
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
      this.httpService.get<IApiResponse<IProperty[]>>(
        this.propertyUrlBuilder.pendingPropertyUrl,
        {
          headers: {
            'x-request-id': requestId,
          },
        },
      ),
    );

    this.logger.log(
      `Pending Property fetched successfully  | request_id=${requestId}`,
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
        this.propertyUrlBuilder.approvePropertyUrl(propertyId),
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
        this.propertyUrlBuilder.rejectPropertyUrl(propertyId),
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
        this.propertyUrlBuilder.archivePropertyUrl(propertyId),
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
        this.propertyUrlBuilder.deletePropertyUrl(propertyId),
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
}
