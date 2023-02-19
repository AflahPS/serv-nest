import { IsNotEmpty } from 'class-validator';

export class ChangeStatus {
  @IsNotEmpty()
  status:
    | 'requested'
    | 'approved'
    | 'denied'
    | 'finished'
    | 'failed'
    | 'postponed';
}
