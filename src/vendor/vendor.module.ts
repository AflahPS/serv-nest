import { Module } from '@nestjs/common';
import { VendorService } from './vendor.service';
import { VendorController } from './vendor.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { vendorSchema } from './vendor.model';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Vendor', schema: vendorSchema }]),
  ],
  providers: [VendorService],
  controllers: [VendorController],
  exports: [VendorService],
})
export class VendorModule {}
