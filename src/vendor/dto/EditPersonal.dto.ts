import {
  IsAlphanumeric,
  IsEmail,
  IsNotEmpty,
  IsNumberString,
  IsString,
  Length,
} from 'class-validator';

export class EditPersonal {
  @IsNotEmpty()
  @IsString()
  @Length(2, 50)
  @IsAlphanumeric()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsNumberString()
  @Length(10)
  phone: string;

  @IsNotEmpty()
  location: {
    type: string;
    coordinates: number[];
  };

  @IsNotEmpty()
  place: string;
}
