import { IsString, IsBoolean, IsOptional } from "class-validator";

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  username?: string;
  
  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsBoolean()
  isPrivate?: boolean;
}