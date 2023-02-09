import { IsNotEmpty } from 'class-validator';

export class GetRole {
  @IsNotEmpty()
  role: 'user' | 'vendor' | 'admin';
}
