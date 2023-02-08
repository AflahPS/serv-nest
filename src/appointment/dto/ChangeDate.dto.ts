import { IsDateString, IsNotEmpty } from 'class-validator';

export class ChangeDate {
  @IsNotEmpty()
  @IsDateString()
  date: string;
}
