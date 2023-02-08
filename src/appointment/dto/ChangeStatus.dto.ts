import { IsNotEmpty } from 'class-validator';

export class ChageStatus {
  @IsNotEmpty()
  status:
    | 'requested'
    | 'approved'
    | 'denied'
    | 'finished'
    | 'failed'
    | 'postponed';
}
