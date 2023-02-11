import { IsNotEmpty } from 'class-validator';

export class CreateMessage {
  @IsNotEmpty()
  text: string;
}
