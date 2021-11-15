import { IsOptional, IsString } from "class-validator";
import { TaksStatus } from "../tasks.model";

export class GetTaskFilterDto {
    @IsOptional()
    status?:TaksStatus;
    @IsOptional()
    @IsString()
    search?:string;
}
