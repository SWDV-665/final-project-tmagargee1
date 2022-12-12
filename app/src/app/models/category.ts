import { Time } from "@angular/common";

export interface Category {
    _id: string | undefined;
    name: string;
    color: string;
    defaultTime: Date;
}