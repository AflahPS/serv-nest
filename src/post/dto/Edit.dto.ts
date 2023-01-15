import { IsMongoId, IsNotEmpty } from 'class-validator';
import { ObjId } from 'src/utils';

export class Edit {
  @IsMongoId()
  _id: string | ObjId;

  @IsNotEmpty()
  mediaType: string;

  media: string[];

  caption: string;

  tagged: string[] | ObjId[];

  project: string[] | ObjId[];
}
