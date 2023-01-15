import { Controller, Get, Param } from '@nestjs/common';
import { VendorService } from './vendor.service';

@Controller('vendor')
export class VendorController {
  constructor(private vendorService: VendorService) {}

  @Get('/:id')
  getSingleVendor(@Param() params: { id: string }) {
    return params.id;
    // return this.vendorService.findVendorById(params.id);
  }
}
