import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Logger,
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
import { IEnquiry } from '../enquiry/interfaces/enquiry.interface';
import { firstValueFrom } from 'rxjs';
import { RequestCreatePropertyDTO } from './dtos/request-create-property.dto';
import { CreatePropertyDTO } from './dtos/create-property.dto';

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
   * Creates a new property.
   *
   * @route POST /properties
   *
   * Requires authentication (JWT).
   * Adds user ID from JWT to DTO.
   * Forwards the request to the downstream service.
   * @param {RequestWithUser} req
   * @param {RequestCreatePropertyDTO} requestCreateEnquiryDto
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtGatewayGuard)
  async createEnquiry(
    @Req() req: RequestWithUser,
    @Body() requestCreateEnquiryDto: RequestCreatePropertyDTO,
  ): Promise<IApiResponse<IEnquiry>> {
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
      this.httpService.post<IApiResponse<IEnquiry>>(
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
}
