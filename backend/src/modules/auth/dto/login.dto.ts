import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail({},{message:"Login must be a correct email-adress "} )
  email: string;

  @IsString()
  password: string;

  @IsString()
  deviceId: string;
}
