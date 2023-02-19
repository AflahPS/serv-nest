import {
  IsDateString,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  Length,
} from 'class-validator';
import { ObjId } from 'src/utils';

export class Create {
  @IsOptional()
  user: string | ObjId;

  @IsNotEmpty()
  @IsMongoId()
  vendor: string | ObjId;

  @IsNotEmpty()
  @Length(2, 250)
  description: string;

  @IsNotEmpty()
  @IsDateString()
  date: string | Date;

  @IsOptional()
  status: string;
}
