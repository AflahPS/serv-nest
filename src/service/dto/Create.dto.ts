import { IsNotEmpty, IsString, IsUrl, Length } from 'class-validator';

export class Create {
  @IsNotEmpty()
  @IsString()
  @Length(2, 50)
  title: string;

  @IsNotEmpty()
  @IsString()
  @Length(2, 250)
  caption: string;

  @IsNotEmpty()
  @IsUrl()
  image: string;
}
