import {StateEnum, StatusEnum, TypeEnum} from "@/enums";

export interface IFilter {
    status: StatusEnum;
    type: TypeEnum;
    state: StateEnum;
    minPrice: number;
    maxPrice: number;
}
