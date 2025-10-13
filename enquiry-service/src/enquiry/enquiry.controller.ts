import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Req,
  Query,
  Param,
  Post,
  Body,
  Patch,
  Logger,
} from '@nestjs/common';
import { EnquiryService } from './enquiry.service';
import { ApiResponse } from '../common/dtos/api-response.dto';
import type { Request } from 'express';
import { IApiResponse } from '../common/interfaces/api-response.interface';
import { IEnquiry } from './interfaces/enquiry.interface';
import { PaginationQueryDto } from './dtos/pagination-query.dto';
import { UpdateEnquiryStatusDto } from './dtos/update-enquiry-status.dto';
import {
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiResponse as SwaggerApiResponse,
} from '@nestjs/swagger';
import { CreateEnquiryDto } from './dtos/create-enquiry.dto';

/**
 * Controller for handling Enquiry endpoints
 */
@Controller('/enquiry')
export class EnquiryController {
  private readonly logger = new Logger(EnquiryController.name);

  constructor(private readonly enquiryService: EnquiryService) {}

  /**
   * Get all enquiries with pagination
   * @param query Pagination query params
   * @param req Express request for x-request-id
   * @returns Paginated ApiResponse
   */
  @Get('/all')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all enquiries with pagination' })
  @SwaggerApiResponse({ status: 200, type: ApiResponse })
  async getEnquiries(
    @Query() query: PaginationQueryDto,
    @Req() req: Request,
  ): Promise<IApiResponse<IEnquiry[]>> {
    const page: number = query.page ?? 1;
    const limit: number = query.limit ?? 10;
    const { items, total } = await this.enquiryService.getEnquiriesPaginated(
      page,
      limit,
    );
    return ApiResponse.paginated(
      items,
      total,
      page,
      limit,
      'Enquiries retrieved successfully',
      HttpStatus.OK,
      req.headers['x-request-id'] as string,
    );
  }

  /**
   * Create a new enquiry
   * @param dto Enquiry creation DTO
   * @param req Express request for x-request-id
   * @returns Created enquiry
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create enquiry' })
  @ApiParam({
    name: 'property_id',
    type: String,
    format: 'uuid',
    required: true,
  })
  @ApiBody({ type: CreateEnquiryDto })
  @SwaggerApiResponse({ status: 201, type: ApiResponse })
  async createEnquiry(
    @Body() dto: CreateEnquiryDto,
    @Req() req: Request,
  ): Promise<IApiResponse<IEnquiry>> {
    const requestId = req.headers['x-request-id'] as string;
    this.logger.log(
      `[${requestId}] Creating enquiry for property ${dto.property_id}`,
    );

    const enquiry = await this.enquiryService.createEnquiry(dto);

    this.logger.log(
      `[${requestId}] Enquiry created successfully (ID=${enquiry.enquiry_id})`,
    );

    return ApiResponse.ok(
      enquiry,
      'Enquiry created successfully',
      HttpStatus.CREATED,
      req.headers['x-request-id'] as string,
    );
  }

  /**
   * Get enquiries for a property with pagination
   * @param propertyId
   * @param query Pagination query params
   * @param req Express request for x-request-id
   * @returns Paginated ApiResponse
   */
  @Get('/property/:propertyId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get enquiries for a property with pagination' })
  @ApiParam({
    name: 'propertyId',
    type: String,
    format: 'uuid',
    required: true,
  })
  @SwaggerApiResponse({ status: 200, type: ApiResponse })
  async getPropertyEnquiries(
    @Param('propertyId') propertyId: string,
    @Query() query: PaginationQueryDto,
    @Req() req: Request,
  ): Promise<IApiResponse<IEnquiry[]>> {
    const page: number = query.page ?? 1;
    const limit: number = query.limit ?? 10;
    const { items, total } = await this.enquiryService.getPropertyEnquiryById(
      propertyId,
      page,
      limit,
    );
    return ApiResponse.paginated(
      items,
      total,
      page,
      limit,
      'Enquiries retrieved successfully',
      HttpStatus.OK,
      req.headers['x-request-id'] as string,
    );
  }

  /**
   * Get enquiry by ID
   * @param enquiryId
   * @param req Express request for x-request-id
   * @returns Enquiry ApiResponse
   */
  @Get('/:enquiryId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get enquiry by ID' })
  @ApiParam({
    name: 'enquiryId',
    type: String,
    format: 'uuid',
    required: true,
  })
  @SwaggerApiResponse({ status: 200, type: ApiResponse })
  async getEnquiryById(
    @Param('enquiryId') enquiryId: string,
    @Req() req: Request,
  ): Promise<IApiResponse<IEnquiry>> {
    const requestId = req.headers['x-request-id'] as string;
    this.logger.log(`[${requestId}] Fetching enquiry with ID: ${enquiryId}`);

    const enquiry = await this.enquiryService.getEnquiryById(enquiryId);

    this.logger.log(`[${requestId}] Enquiry ${enquiryId} fetched successfully`);

    return ApiResponse.ok(
      enquiry,
      'Enquiry fetched successfully',
      HttpStatus.OK,
      req.headers['x-request-id'] as string,
    );
  }

  /**
   * Update enquiry status
   * @param enquiry_id UUID of the enquiry
   * @param dto Status update DTO
   * @param req Express request for x-request-id
   * @returns Updated enquiry ApiResponse
   */
  @Patch('/:enquiry_id/status')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update enquiry status' })
  @ApiParam({
    name: 'enquiry_id',
    type: String,
    format: 'uuid',
    required: true,
  })
  @ApiBody({ type: UpdateEnquiryStatusDto })
  @SwaggerApiResponse({ status: 200, type: ApiResponse })
  async changeEnquiryStatus(
    @Param('enquiry_id') enquiry_id: string,
    @Body() dto: UpdateEnquiryStatusDto,
    @Req() req: Request,
  ): Promise<IApiResponse<IEnquiry>> {
    const updated = await this.enquiryService.changeEnquiryStatus(
      enquiry_id,
      dto.status,
    );
    return ApiResponse.ok(
      updated,
      'Enquiry status updated successfully',
      HttpStatus.OK,
      req.headers['x-request-id'] as string,
    );
  }
}
