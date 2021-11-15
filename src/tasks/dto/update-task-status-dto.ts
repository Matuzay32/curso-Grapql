import { IsEnum } from "class-validator";
import { TaksStatus } from "../tasks.model";

export class UpdateTaskStatusDto {
    @IsEnum(TaksStatus)
    status:TaksStatus;
}
