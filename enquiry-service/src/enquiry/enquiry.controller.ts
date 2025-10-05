import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';
import { ApiResponse } from '../common/dtos/api-response.dto';
import { EnquiryService } from './enquiry.service';
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';
import { IApiResponse } from '../common/interfaces/api-response.interface';
import { IEnquiry } from './enquiry.interface';
import {
  CreateEnquiryDto,
  RequestCreateEnquiryDto,
} from './dtos/create-enquiry.dto';
import { UpdateEnquiryStatusDto } from './dtos/updata-enquiry-status.dto';

@Controller()
class EnquiryController {
  constructor(private readonly enquiryService: EnquiryService) {}

  @Get('/enquiry/all')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all enquiries' })
  @ApiOkResponse({ type: ApiResponse })
  async getEnquiries(@Req() req: Request): Promise<IApiResponse<IEnquiry[]>> {
    const enquiries = await this.enquiryService.getEnquiries();

    return ApiResponse.ok(
      enquiries,
      'Enquiries received successfully',
      HttpStatus.OK,
      req.headers['x-request-id'] as string,
    );
  }

  @Post('/properties/:property_id/enquiries')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create enquiry' })
  @ApiParam({
    name: 'property_id',
    type: String,
    format: 'uuid',
    required: true,
    description: 'Property ID',
  })
  @ApiBody({ type: RequestCreateEnquiryDto })
  @ApiOkResponse({ type: ApiResponse })
  async createEnquiry(
    @Param('property_id')
    property_id: string,
    @Body() dto: RequestCreateEnquiryDto,
    @Req() req: Request,
  ): Promise<IApiResponse<IEnquiry>> {
    // Ensure propertyId from URL is used
    const enquiryData: CreateEnquiryDto & { property_id: string } = {
      ...dto,
      property_id,
    };

    const enquiry = await this.enquiryService.createEnquiry(enquiryData);

    return ApiResponse.ok(
      enquiry,
      'Enquiries received successfully',
      HttpStatus.CREATED,
      req.headers['x-request-id'] as string,
    );
  }

  @Get('/properties/:property_id/enquiries')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all enquiries for particular enquiries' })
  @ApiOkResponse({ type: ApiResponse })
  async getPropertyEnquiries(
    @Param('property_id') property_id: string,
    @Req() req: Request,
  ): Promise<IApiResponse<IEnquiry[]>> {
    const enquiries =
      await this.enquiryService.getPropertyEnquiryById(property_id);

    return ApiResponse.ok(
      enquiries,
      'Enquiries received successfully',
      HttpStatus.OK,
      req.headers['x-request-id'] as string,
    );
  }

  @Get('/enquiries/:enquiry_id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get enquiries for an id' })
  @ApiOkResponse({ type: ApiResponse })
  async getEnquiryById(
    @Param('enquiry_id') enquiry_id: string,
    @Req() req: Request,
  ): Promise<IApiResponse<IEnquiry>> {
    const enquiry = await this.enquiryService.getEnquiryById(enquiry_id);

    return ApiResponse.ok(
      enquiry,
      'enquiry fetched successfully',
      HttpStatus.OK,
      req.headers['x-request-id'] as string,
    );
  }

  @Patch('enquiries/:enquiry_id/status')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update enquiry status' })
  @ApiOkResponse({ type: ApiResponse })
  @ApiParam({
    name: 'enquiry_id',
    type: String,
    format: 'uuid',
    required: true,
    description: 'Enquiry ID',
  })
  @ApiBody({ type: UpdateEnquiryStatusDto })
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

export default EnquiryController;
