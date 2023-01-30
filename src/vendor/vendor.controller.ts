import { Body, Controller, Patch, UseGuards } from '@nestjs/common';
import { VendorService } from './vendor.service';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { Vendor } from './vendor.model';
import { EditProfessional } from './dto';

@Controller('vendor')
export class VendorController {
  constructor(private vendorService: VendorService) {}

  @UseGuards(JwtGuard)
  @Patch('/professional')
  editVendorProfessional(
    @Body() dto: EditProfessional,
    @GetUser() vendor: Vendor,
  ) {
    return this.vendorService.updateVendorData(dto, vendor);
  }
}
