import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
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
import { GetUser } from 'src/auth/decorator';
import { User } from 'src/user/user.model';
import { checkIfAdmin } from 'src/utils/util.functions';

@Controller('service')
export class ServiceController {
  constructor(private serviceService: ServiceService) {}

  @Post()
  @UseGuards(JwtGuard)
  createService(@GetUser() user: User, @Body() dto: Create) {
    if (!checkIfAdmin(user))
      throw new ForbiddenException('Unauthorized to create service !');
    return this.serviceService.addService(dto);
  }

  @Patch('/:id')
  @UseGuards(JwtGuard)
  editService(@Body() dto: Create, @Param() params: MongoId) {
    return this.serviceService.updateServiceData(dto, params.id);
  }

  @Delete('/:id')
  @UseGuards(JwtGuard)
  deleteService(@GetUser() user: User, @Param() params: MongoId) {
    if (!checkIfAdmin(user))
      throw new ForbiddenException('Unauthorized for this operation !');
    return this.serviceService.deleteService(params.id);
  }

  @Get()
  getAllServices() {
    return this.serviceService.findAllServices();
  }

  @Get('titles')
  getServiceTitle() {
    return this.serviceService.getServicesTitle();
  }

  @Get('vendor/:id')
  getVendorsByServiceId(@Param() params: MongoId) {
    return this.serviceService.getVendorsByServiceId(params.id);
  }
}
