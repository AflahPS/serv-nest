import {
  IsNotEmpty,
  IsString,
  IsAlphanumeric,
  Length,
  // IsLatLong,
} from 'class-validator';

export class SignupVendor {
  @IsNotEmpty()
  @IsString()
  @Length(2, 50)
  @IsAlphanumeric()
  service: string;

  @IsNotEmpty()
  // @IsLatLong()
  location: { type: string; coordinates: [number] };

  @IsNotEmpty()
  @IsString()
  @Length(6, 20)
  phone: string;

  @IsNotEmpty()
  @IsString()
  @Length(6, 250)
  about: string;
}
