import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ServiceService } from './service.service';
import { JwtGuard } from 'src/auth/guard';
import { Create } from './dto/Create.dto';
import { MongoId } from 'src/utils';

@Controller('service')
export class ServiceController {
  constructor(private serviceService: ServiceService) {}

  @Post()
  @UseGuards(JwtGuard)
  createService(@Body() dto: Create) {
    return this.serviceService.addService(dto);
  }

  @Patch('/:id')
  @UseGuards(JwtGuard)
  editService(@Body() dto: Create, @Param() params: MongoId) {
    return this.serviceService.updateServiceData(dto, params.id);
  }

  @Get()
  getAllServices() {
    return this.serviceService.findAllServices();
  }
}
