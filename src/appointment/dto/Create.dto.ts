import {
  IsDateString,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';
import { ObjId } from 'src/utils';

export class Create {
  @IsOptional()
  user: string | ObjId;

  @IsNotEmpty()
  @IsMongoId()
  vendor: string | ObjId;

  @IsNotEmpty()
  @IsDateString()
  date: string | Date;

  @IsOptional()
  status: string;
}
