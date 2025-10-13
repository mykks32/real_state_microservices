import { StateEnum } from '../enums/state.enum';
import { Base } from './base.interface';

export interface Location extends Base {
  id: number;
  address: string;
  city: string;
  state: StateEnum;
  country: string;
  zipcode: number;
  latitude?: number;
  longitude?: number;
}
