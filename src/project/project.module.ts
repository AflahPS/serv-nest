import { Module } from '@nestjs/common';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { MongooseModule } from '@nestjs/mongoose';
import { projectSchema } from './project.model';
import { VendorModule } from 'src/vendor/vendor.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Project', schema: projectSchema }]),
    VendorModule,
  ],
  controllers: [ProjectController],
  providers: [ProjectService],
  exports: [ProjectService],
})
export class ProjectModule {}
