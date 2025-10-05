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
} from '@nestjs/common';
import { EnquiryService } from './enquiry.service';
import { ApiResponse } from '../common/dtos/api-response.dto';
import type { Request } from 'express';
import { IApiResponse } from '../common/interfaces/api-response.interface';
import { IEnquiry } from './enquiry.interface';
import { PaginationQueryDto } from './dtos/pagination-query.dto';
import { RequestCreateEnquiryDto } from './dtos/create-enquiry.dto';
import { UpdateEnquiryStatusDto } from './dtos/update-enquiry-status.dto';
import {
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiResponse as SwaggerApiResponse,
} from '@nestjs/swagger';

/**
 * Controller for handling Enquiry endpoints
 */
@Controller('/enquiries')
export class EnquiryController {
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
   * @param property_id UUID of the property
   * @param dto Enquiry creation DTO
   * @param req Express request for x-request-id
   * @returns Created enquiry
   */
  @Post('/properties/:property_id')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create enquiry' })
  @ApiParam({
    name: 'property_id',
    type: String,
    format: 'uuid',
    required: true,
  })
  @ApiBody({ type: RequestCreateEnquiryDto })
  @SwaggerApiResponse({ status: 201, type: ApiResponse })
  async createEnquiry(
    @Param('property_id') property_id: string,
    @Body() dto: RequestCreateEnquiryDto,
    @Req() req: Request,
  ): Promise<IApiResponse<IEnquiry>> {
    const enquiry = await this.enquiryService.createEnquiry({
      ...dto,
      property_id,
    });
    return ApiResponse.ok(
      enquiry,
      'Enquiry created successfully',
      HttpStatus.CREATED,
      req.headers['x-request-id'] as string,
    );
  }

  /**
   * Get enquiries for a property with pagination
   * @param property_id UUID of the property
   * @param query Pagination query params
   * @param req Express request for x-request-id
   * @returns Paginated ApiResponse
   */
  @Get('/properties/:property_id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get enquiries for a property with pagination' })
  @ApiParam({
    name: 'property_id',
    type: String,
    format: 'uuid',
    required: true,
  })
  @SwaggerApiResponse({ status: 200, type: ApiResponse })
  async getPropertyEnquiries(
    @Param('property_id') property_id: string,
    @Query() query: PaginationQueryDto,
    @Req() req: Request,
  ): Promise<IApiResponse<IEnquiry[]>> {
    const page: number = query.page ?? 1;
    const limit: number = query.limit ?? 10;
    const { items, total } = await this.enquiryService.getPropertyEnquiryById(
      property_id,
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
   * @param enquiry_id UUID of the enquiry
   * @param req Express request for x-request-id
   * @returns Enquiry ApiResponse
   */
  @Get('/:enquiry_id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get enquiry by ID' })
  @ApiParam({
    name: 'enquiry_id',
    type: String,
    format: 'uuid',
    required: true,
  })
  @SwaggerApiResponse({ status: 200, type: ApiResponse })
  async getEnquiryById(
    @Param('enquiry_id') enquiry_id: string,
    @Req() req: Request,
  ): Promise<IApiResponse<IEnquiry>> {
    const enquiry = await this.enquiryService.getEnquiryById(enquiry_id);
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
