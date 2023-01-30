import { Module } from '@nestjs/common';
import { VendorService } from './vendor.service';
import { VendorController } from './vendor.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { vendorSchema } from './vendor.model';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Vendor', schema: vendorSchema }]),
    UserModule,
  ],
  providers: [VendorService],
  controllers: [VendorController],
  exports: [VendorService],
})
export class VendorModule {}
