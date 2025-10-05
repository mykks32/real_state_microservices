import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';
import { ApiResponse } from '../common/dtos/api-response.dto';
import { EnquiryService } from './enquiry.service';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { IApiResponse } from '../common/interfaces/api-response.interface';
import { IEnquiry } from './enquiry.interface';
import {
  CreateEnquiryDto,
  RequestCreateEnquiryDto,
} from './dtos/create-enquiry.dto';

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
}

export default EnquiryController;
