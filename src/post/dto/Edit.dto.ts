import { IsMongoId, IsNotEmpty, IsOptional } from 'class-validator';
import { ObjId } from 'src/utils';

export class Edit {
  @IsMongoId()
  @IsNotEmpty()
  _id: string | ObjId;

  @IsNotEmpty()
  mediaType: string;

  @IsOptional()
  media: string[];

  @IsOptional()
  caption: string;

  @IsOptional()
  tagged: string[] | ObjId[];

  @IsOptional()
  project: string | ObjId;
}
