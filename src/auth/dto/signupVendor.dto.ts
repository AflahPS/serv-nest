import {
  IsNotEmpty,
  IsString,
  IsAlphanumeric,
  Length,
  // IsLatLong,
} from 'class-validator';

export class signupVendor {
  @IsNotEmpty()
  @IsString()
  @Length(2, 50)
  @IsAlphanumeric()
  service: string;

  @IsNotEmpty()
  // @IsLatLong()
  location: { lat: string; lon: string };

  @IsNotEmpty()
  @IsString()
  @Length(6, 20)
  phone: string;

  @IsNotEmpty()
  @IsString()
  @Length(6, 250)
  about: string;
}
