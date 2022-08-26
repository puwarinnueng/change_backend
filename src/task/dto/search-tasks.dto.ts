import { IsOptional } from "class-validator";

export class SearchTaskDto {
    
    @IsOptional()
    search?: string

    
}