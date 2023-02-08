import { IsNotEmpty, IsOptional } from 'class-validator';

export class Create {
  @IsOptional()
  user: string;

  @IsNotEmpty()
  content: string;

  @IsNotEmpty()
  type: 'error' | 'warning' | 'info' | 'success';

  @IsOptional()
  href: string;
}
