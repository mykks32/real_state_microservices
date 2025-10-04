import { Controller, Get, HttpCode, HttpStatus, Req } from '@nestjs/common';
import type { Request } from 'express';
import { ApiResponse } from '../common/dtos/api-response.dto';
import { EnquiryService } from './enquiry.service';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { IApiResponse } from '../common/interfaces/api-response.interface';
import { IEnquiry } from './enquiry.interface';

@Controller('enquiry')
class EnquiryController {
  constructor(private readonly enquiryService: EnquiryService) {}

  @Get('all')
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
}

export default EnquiryController;
