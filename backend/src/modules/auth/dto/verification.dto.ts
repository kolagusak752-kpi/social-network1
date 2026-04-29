import {IsEmail, IsString} from 'class-validator';

export class VerificationDto {
    @IsEmail()
    email!: string;
    @IsString()
    code!: string;
}