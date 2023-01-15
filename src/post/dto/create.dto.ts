import { IsNotEmpty } from 'class-validator';
import { ObjId } from 'src/utils';

export class Create {
  owner: string | ObjId;

  @IsNotEmpty()
  mediaType: string;

  media: string[];

  caption: string;

  tagged: string[] | ObjId[];

  project: string[] | ObjId[];
}
