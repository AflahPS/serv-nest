import {
  IsEmail,
  IsNotEmpty,
  IsNumberString,
  IsString,
  Length,
} from 'class-validator';

export class Edit {
  @IsNotEmpty()
  @IsString()
  @Length(2, 50)
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
