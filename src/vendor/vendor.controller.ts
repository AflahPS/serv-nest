import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { VendorService } from './vendor.service';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { Vendor } from './vendor.model';
import { EditProfessional } from './dto';
import { MongoId } from 'src/utils';
import { User } from 'src/user/user.model';

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

  @UseGuards(JwtGuard)
  @Post('/employee/:id')
  addEmployee(@Param() params: MongoId, @GetUser() user: User) {
    return this.vendorService.addEmployee(params.id, user.vendor?._id);
  }

  @UseGuards(JwtGuard)
  @Patch('/employee/:id')
  removeEmployee(@Param() params: MongoId, @GetUser() user: User) {
    return this.vendorService.removeEmployee(params.id, user.vendor?._id);
  }
}
