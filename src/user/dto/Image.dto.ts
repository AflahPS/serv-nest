import { IsNotEmpty, IsUrl } from 'class-validator';

export class Image {
  @IsNotEmpty()
  @IsUrl()
  image: string;
}
