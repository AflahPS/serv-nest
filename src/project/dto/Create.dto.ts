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
  @IsOptional()
  service: string;

  @IsOptional()
  status: 'pending' | 'running' | 'completed' | 'cancelled' | 'failed';

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

  @IsOptional()
  employees: string[];

  @IsNotEmpty()
  @IsDateString()
  startDate: string;

  @IsNotEmpty()
  @IsDateString()
  endDate: string;

  @IsOptional()
  caption: string;
}
