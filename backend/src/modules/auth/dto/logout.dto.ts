import { IsString } from "class-validator"

export class LogogutDto {
    @IsString()
    refreshToken!: string
}