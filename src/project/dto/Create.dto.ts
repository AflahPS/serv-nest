import {
  IsDateString,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';

export class Create {
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsMongoId()
  vendor: string;

  @IsNotEmpty()
  @IsMongoId()
  service: string;

  @IsOptional()
  status: 'active' | 'completed' | 'cancelled';

  @IsNotEmpty()
  location: {
    type: 'Point';
    coordinates: number[];
  };

  @IsOptional()
  place: string;

  @IsOptional()
  @IsMongoId()
  client: string;

  @IsNotEmpty()
  @IsDateString()
  startDate: string;

  @IsNotEmpty()
  @IsDateString()
  endDate: string;

  @IsOptional()
  caption: string;
}
