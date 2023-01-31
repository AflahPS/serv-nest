import { IsMongoId, IsNotEmpty, IsOptional } from 'class-validator';
import { ObjId } from 'src/utils';

export class Create {
  @IsNotEmpty()
  @IsMongoId()
  post: string;

  @IsOptional()
  user: ObjId | string;

  @IsNotEmpty()
  content: string;
}
