import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { VendorService } from './vendor.service';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { Vendor } from './vendor.model';
import { EditPersonal, EditProfessional, Image } from './dto';

@Controller('vendor')
export class VendorController {
  constructor(private vendorService: VendorService) {}

  @Get('/:id')
  getSingleVendor(@Param() params: { id: string }) {
    return params.id;
    // return this.vendorService.findVendorById(params.id);
  }

  @UseGuards(JwtGuard)
  @Patch('/personal')
  editVendorPersonal(@Body() dto: EditPersonal, @GetUser() vendor: Vendor) {
    return this.vendorService.updateVendorData(dto, vendor);
  }

  @UseGuards(JwtGuard)
  @Patch('/professional')
  editVendorProfessional(
    @Body() dto: EditProfessional,
    @GetUser() vendor: Vendor,
  ) {
    return this.vendorService.updateVendorData(dto, vendor);
  }

  @UseGuards(JwtGuard)
  @Patch('/image')
  changeImage(@Body() dto: Image, @GetUser() vendor: Vendor) {
    return this.vendorService.updateVendorData(dto, vendor);
  }
}
