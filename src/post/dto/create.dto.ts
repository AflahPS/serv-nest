import { IsMongoId, IsNotEmpty, IsOptional } from 'class-validator';
import { ObjId } from 'src/utils';

export class Create {
  @IsOptional()
  @IsMongoId()
  owner?: string | ObjId;

  @IsNotEmpty()
  mediaType: string;

  @IsOptional()
  media?: string[];

  @IsNotEmpty()
  caption: string;

  @IsOptional()
  tagged?: string[] | ObjId[];

  @IsNotEmpty()
  @IsMongoId()
  project: string | ObjId;
}
