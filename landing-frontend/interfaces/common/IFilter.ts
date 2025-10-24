import {StateEnum, StatusEnum, TypeEnum} from "@/enums";

export interface IFilter {
    status?: StatusEnum;
    type?: TypeEnum;
    state?: StateEnum;
    page: number;
    size: number;
}
