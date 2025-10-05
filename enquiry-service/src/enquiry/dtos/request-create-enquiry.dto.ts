import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";

export class RequestCreateEnquiryDto {
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty()
  user_id: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  message?: string; // optional message
}