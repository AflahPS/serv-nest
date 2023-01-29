import {
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  // IsLatLong,
} from 'class-validator';
import { ObjId } from 'src/utils';

export class SignupVendor {
  @IsOptional()
  @IsMongoId()
  user: string | ObjId;

  @IsNotEmpty()
  @IsString()
  @Length(2, 50)
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

  @IsNotEmpty()
  @IsString()
  place: string;
}
