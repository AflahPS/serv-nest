import { Module } from '@nestjs/common';
import { ServiceService } from './service.service';
import { ServiceController } from './service.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { serviceSchema } from './service.model';
import { VendorModule } from 'src/vendor/vendor.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Service', schema: serviceSchema }]),
    VendorModule,
  ],
  providers: [ServiceService],
  controllers: [ServiceController],
})
export class ServiceModule {}
