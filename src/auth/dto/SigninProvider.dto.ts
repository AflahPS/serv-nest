import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class SigninProviderDto {
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  phone: string;

  @IsOptional()
  image: string;

  @IsNotEmpty()
  provider: string;

  @IsNotEmpty()
  idToken: string;
}
