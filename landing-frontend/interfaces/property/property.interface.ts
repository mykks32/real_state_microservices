import { ApprovalStatusEnum } from '@/enums/approval-status.enum';
import { IBase } from './base.interface';
import { TypeEnum } from '@/enums/type.enum';
import { StatusEnum } from '@/enums/status.enum';
import { ILocation } from './location.interface';

export interface IProperty extends IBase {
  id: string; // UUID
  title: string;
  description?: string;
  type: TypeEnum;
  status: StatusEnum;
  approvalStatus: ApprovalStatusEnum;
  ownerId?: string; // UUID
  location: ILocation;
}
