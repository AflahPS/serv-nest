import {
  IsNotEmpty,
  IsString,
  IsEmail,
  IsAlphanumeric,
  Length,
} from 'class-validator';
import { Match } from '../decorator';

export class signupDto {
  @IsNotEmpty()
  @IsString()
  @Length(2, 50)
  @IsAlphanumeric()
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
}