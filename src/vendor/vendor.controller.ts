import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { VendorService } from './vendor.service';
import { signupDto } from 'src/auth/dto';

@Controller('vendor')
export class VendorController {
  constructor(private vendorService: VendorService) {}

  @Post('primary')
  insertVendorPrimary(@Body() dto: signupDto) {
    return dto;
    // return this.vendorService.insertVendorPrimary(dto);
  }
  @Post('secondary')
  insertVendorSecondary(@Body() dto: signupDto) {
    return dto;
    // return this.vendorService.insertVendorSecondary(dto);
  }

  @Get('single/:id')
  getSingleVendor(@Param() params: { id: string }) {
    return params.id;
    // return this.vendorService.findVendorById(params.id);
  }
}
