import { IsNotEmpty, IsOptional } from 'class-validator';

export class Create {
  @IsOptional()
  author: string;

  @IsNotEmpty()
  receiver: string;

  @IsNotEmpty()
  content: string;

  @IsNotEmpty()
  type: 'error' | 'warning' | 'info' | 'success';

  @IsOptional()
  href: string;
}
