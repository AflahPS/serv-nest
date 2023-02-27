import {
  IsMongoId,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
} from 'class-validator';

export class PaginationParams {
  @IsOptional()
  @IsMongoId()
  id: string;

  @IsNotEmpty()
  @IsNumberString()
  page: string;

  @IsNotEmpty()
  @IsNumberString()
  limit: string;
}
