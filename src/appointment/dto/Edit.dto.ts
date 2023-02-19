import { IsDateString, IsNotEmpty, Length } from 'class-validator';

export class Edit {
  @IsNotEmpty()
  @Length(2, 250)
  description: string;

  @IsNotEmpty()
  @IsDateString()
  date: string | Date;
}
