import { IsLatLong, IsMongoId, IsNotEmpty } from 'class-validator';

export class VendorByLocation {
  @IsMongoId()
  serviceId: string;

  @IsNotEmpty()
  @IsLatLong()
  lnglat: string;
}
