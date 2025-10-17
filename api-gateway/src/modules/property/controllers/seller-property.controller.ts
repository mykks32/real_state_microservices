import { RequestWithUserContext } from '../../../common/types/request-with-context.type';
import { PropertyUrlBuilder } from '../utils/property-url.builder';
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
  Put,
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
import { RequestCreatePropertyDTO } from '../dtos/request-create-property.dto';
import { CreatePropertyDTO } from '../dtos/create-property.dto';
import { UpdatePropertyDTO } from '../dtos/update-property.dto';
import { ApprovalStatusEnum } from '../enums/approval-status.enum';
import { ApiBearerAuth, ApiTags, ApiCookieAuth } from '@nestjs/swagger';
import { SellerPropertySwaggerConstant } from '../constants/seller-property-swagger.constant';
import {
  ApiCreateProperty,
  ApiGetPropertiesByOwner,
  ApiUpdateProperty,
  ApiSubmitForApproval,
} from '../decorators/seller-property-swagger.decorator';

/**
 * SellerPropertyController
 *
 * Handles property-related API endpoints for sellers.
 *
 * All routes require:
 * - JWT auth-service
 * - The user must have the SELLER or ADMIN role (by default, enforced at route level)
 *
 * Routes:
 * - POST   /property                      → Create a new property
 * - GET    /property/owner                → Get properties by current seller (owner ID)
 * - PUT    /property/:propertyId          → Update a property
 * - PATCH  /property/:propertyId/submit   → Submit a property for approval
 *
 * @route /property
 * @remarks
 * Forwards requests to downstream services using HttpService.
 * Adds contextual data like user ID and request ID from headers.
 */
@Controller('property')
@UseGuards(JwtGatewayGuard, RolesGuard)
@Roles(Role.ADMIN, Role.SELLER)
@ApiTags(SellerPropertySwaggerConstant.TAGS.SELLER_PROPERTY)
@ApiBearerAuth(SellerPropertySwaggerConstant.SECURITY.BEARER_AUTH)
@ApiCookieAuth(SellerPropertySwaggerConstant.COOKIES.REALSTATE_TOKEN.name)
export class SellerPropertyController {
  /** Logger instance scoped to SellerPropertyController. */
  private readonly logger = new Logger(SellerPropertyController.name);

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
   * Creates a new property.
   *
   * @route POST /properties
   * @param {RequestWithUserContext} req
   * @param {RequestCreatePropertyDTO} requestCreatePropertyDto
   *
   * @remarks
   * Requires auth-service (JWT).
   * Adds user ID from JWT to DTO.
   * Forwards the request to the downstream service.
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtGatewayGuard)
  @ApiCreateProperty()
  async createProperty(
    @Req() req: RequestWithUserContext,
    @Body() requestCreatePropertyDto: RequestCreatePropertyDTO,
  ): Promise<IApiResponse<IProperty>> {
    const userId = req.user.id;
    const requestId = req.headers['x-request-id'] as string;

    const payload: CreatePropertyDTO = {
      ...requestCreatePropertyDto,
      approvalStatus: ApprovalStatusEnum.Draft,
      ownerId: userId,
    };

    this.logger.log(
      `Property creation started | property title=${payload.title} | user_id=${userId} | request_id=${requestId}`,
    );

    const response = await firstValueFrom(
      this.httpService.post<IApiResponse<IProperty>>(
        this.propertyUrlBuilder.createPropertyUrl,
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
   * @param {RequestWithUserContext} req
   * @returns {Promise<IApiResponse<IProperty[]>>} Paginated enquiries for the property.
   *
   * @remarks
   * Requires auth-service (JWT).
   * Adds user ID from JWT to DTO.
   * Forwards the request to the downstream service.
   */
  @Get('/owner')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGatewayGuard)
  @ApiGetPropertiesByOwner()
  async getPropertyByOwnerId(
    @Req() req: RequestWithUserContext,
    // @Query() query: PaginationQueryDto,
  ): Promise<IApiResponse<IProperty[]>> {
    const requestId = req.headers['x-request-id'] as string;

    const ownerId = req.user.id;

    this.logger.log(
      `Fetching Properties | ownerId= ${ownerId} | request_id = ${requestId}`,
    );

    const response = await firstValueFrom(
      this.httpService.get<IApiResponse<IProperty[]>>(
        this.propertyUrlBuilder.getPropertyByOwnerIdUrl(ownerId),
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
  @ApiSubmitForApproval()
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
        this.propertyUrlBuilder.submitPropertyApprovalUrl(propertyId),
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
   * Update property info.
   *
   * @route PUT /property_id
   * @param {RequestWithUserContext} req
   * @param propertyId
   * @param {UpdatePropertyDTO} updatePropertyDTO
   *
   * @remarks
   * Requires auth-service (JWT).
   * Adds user ID from JWT to DTO.
   * Forwards the request to the downstream service.
   */
  @Put('/:propertyId')
  @HttpCode(HttpStatus.OK)
  @ApiUpdateProperty()
  async updateProperty(
    @Req() req: Request,
    @Param('propertyId') propertyId: string,
    @Body() updatePropertyDTO: UpdatePropertyDTO,
  ): Promise<IApiResponse<IProperty>> {
    const requestId = req.headers['x-request-id'] as string;

    this.logger.log(`Updating Property started | request_id=${requestId}`);

    const response = await firstValueFrom(
      this.httpService.put<IApiResponse<IProperty>>(
        this.propertyUrlBuilder.updatePropertyUrl(propertyId),
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
