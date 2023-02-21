import { IsMongoId, IsNotEmpty } from 'class-validator';

export class RoleChange {
  @IsNotEmpty()
  from: 'admin' | 'user' | 'super-admin';

  @IsNotEmpty()
  to: 'admin' | 'user' | 'super-admin';

  @IsNotEmpty()
  @IsMongoId()
  id: string;
}
