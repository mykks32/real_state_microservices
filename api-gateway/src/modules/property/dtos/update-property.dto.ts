// import {
//   IsEnum,
//   IsOptional,
//   IsString,
//   IsUUID,
//   MaxLength,
//   ValidateNested,
// } from 'class-validator';
// import { TypeEnum } from '../enums/type.enum';
// import { StatusEnum } from '../enums/status.enum';
// import { Type } from 'class-transformer';
// import { UpdateLocationDTO } from './update-location.dto';
//
// export class UpdatePropertyDTO {
//   @IsOptional()
//   @IsString()
//   @MaxLength(150, { message: 'Title cannot exceed 150 characters' })
//   title?: string;
//
//   @IsOptional()
//   @IsString()
//   @MaxLength(500, { message: 'Description cannot exceed 500 characters' })
//   description?: string;
//
//   @IsOptional()
//   @IsEnum(TypeEnum, { message: 'Invalid property type' })
//   type?: TypeEnum;
//
//   @IsOptional()
//   @IsEnum(StatusEnum, { message: 'Invalid property status' })
//   status?: StatusEnum;
//
//   @IsOptional()
//   @ValidateNested()
//   @Type(() => UpdateLocationDTO)
//   location?: UpdateLocationDTO;
//
//   @IsOptional()
//   @IsUUID('4', { message: 'Owner id must be a valid UUID' })
//   ownerId?: string;
// }

import { PartialType } from '@nestjs/mapped-types';
import { CreatePropertyDTO } from './create-property.dto';

export class UpdatePropertyDTO extends PartialType(CreatePropertyDTO) {}
