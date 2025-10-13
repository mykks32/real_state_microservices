import { IsUUID } from 'class-validator';
import { RequestCreatePropertyDTO } from './request-create-property.dto';

export class CreatePropertyDTO extends RequestCreatePropertyDTO {
  @IsUUID('4', { message: 'Owner id must be a valid UUID' })
  ownerId: string;
}
