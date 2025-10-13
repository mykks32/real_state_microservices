import { StateEnum } from '../enums/state.enum';
import { IBase } from './base.interface';

export interface ILocation extends IBase {
  id: number;
  address: string;
  city: string;
  state: StateEnum;
  country: string;
  zipcode: number;
  latitude?: number;
  longitude?: number;
}
