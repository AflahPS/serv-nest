import { IsMongoId, IsNotEmpty, IsNumberString, Length } from 'class-validator';

export class EditProfessional {
  @IsNotEmpty()
  @IsMongoId()
  service: string;

  @IsNotEmpty()
  workingDays: string;

  @IsNotEmpty()
  @IsNumberString()
  workRadius: string;

  @IsNotEmpty()
  @IsNumberString()
  experience: string;

  @IsNotEmpty()
  @Length(2, 250)
  description: string;

  employees: string[];
}
