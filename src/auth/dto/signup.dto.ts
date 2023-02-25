import { IsNotEmpty, IsString, IsEmail, Length } from 'class-validator';
import { Match } from '../decorator';

export class SignupDto {
  @IsNotEmpty()
  @IsString()
  @Length(2, 50)
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Length(6, 20)
  password: string;

  @IsNotEmpty()
  @IsString()
  @Length(6, 20)
  @Match('password')
  repeatPassword: string;

  role?: string;
}
