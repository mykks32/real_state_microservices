import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { TypeEnum } from '../enums/type.enum';
import { StatusEnum } from '../enums/status.enum';
import { ApprovalStatusEnum } from '../enums/approval-status.enum';
import { Type } from 'class-transformer';
import { CreateLocationDTO } from './create-location.dto';

export class RequestCreatePropertyDTO {
  @IsNotEmpty({ message: 'Title is required' })
  @IsString()
  @MaxLength(150, { message: 'Title cannot exceed 150 characters' })
  title: string;

  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'Description cannot exceed 500 characters' })
  description?: string;

  @IsEnum(TypeEnum, { message: 'Property type is required' })
  type: TypeEnum = TypeEnum.Land;

  @IsEnum(StatusEnum, { message: 'Property status is required' })
  status: StatusEnum = StatusEnum.Available;

  @IsEnum(ApprovalStatusEnum, {
    message: 'Property approvalStatus is required',
  })
  approvalStatus: ApprovalStatusEnum = ApprovalStatusEnum.Draft;

  @ValidateNested()
  @Type(() => CreateLocationDTO)
  location: CreateLocationDTO;
}
