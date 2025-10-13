import { ApprovalStatusEnum } from '../enums/approval-status.enum';
import { Base } from './base.interface';
import { TypeEnum } from '../enums/type.enum';
import { StatusEnum } from '../enums/status.enum';

export interface Property extends Base {
  id: string; // UUID
  title: string;
  description?: string;
  type: TypeEnum;
  status: StatusEnum;
  approvalStatus: ApprovalStatusEnum;
  ownerId?: string; // UUID
  location: Location;
}
