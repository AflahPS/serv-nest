import { IsMongoId, IsNotEmpty } from 'class-validator';

export class MongoId {
  @IsNotEmpty()
  @IsMongoId()
  id: string;
}
