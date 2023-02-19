import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { JwtGuard } from 'src/auth/guard';
import { Create } from './dto/Create.dto';
import { GetUser } from 'src/auth/decorator';
import { User } from 'src/user/user.model';
import { ChangeStatus } from './dto/ChangeStatus.dto';
import { MongoId } from 'src/utils';
import { ChangeDate } from './dto/ChangeDate.dto';
import { Edit } from './dto/Edit.dto';

@Controller('appointment')
export class AppointmentController {
  constructor(private appoService: AppointmentService) {}

  @UseGuards(JwtGuard)
  @Post()
  makeAppointment(@Body() dto: Create, @GetUser() user: User) {
    dto.user = user._id;
    return this.appoService.createAppointment(dto);
  }

  @UseGuards(JwtGuard)
  @Get('vendor')
  getAppointmentsForVendor(@GetUser() user: User) {
    return this.appoService.getAppointmentsForVendor(user._id);
  }

  @UseGuards(JwtGuard)
  @Get('user')
  getAppointmentsForUser(@GetUser() user: User) {
    return this.appoService.getAppointmentsForUser(user._id);
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  editAppointment(
    @Param() params: MongoId,
    @Body() dto: Edit,
    @GetUser() user: User,
  ) {
    return this.appoService.editStatus(params.id, dto, user._id);
  }

  @UseGuards(JwtGuard)
  @Patch('/status/:id')
  changeStatus(
    @Param() params: MongoId,
    @Body() dto: ChangeStatus,
    @GetUser() user: User,
  ) {
    return this.appoService.changeStatus(params.id, dto.status, user._id);
  }

  @UseGuards(JwtGuard)
  @Patch('/date/:id')
  changeDate(
    @Param() params: MongoId,
    @Body() dto: ChangeDate,
    @GetUser() user: User,
  ) {
    return this.appoService.changeDate(params.id, dto.date, user._id);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  deleteAppointment(@Param() params: MongoId, @GetUser() user: User) {
    return this.appoService.deleteAppointment(params.id, user._id);
  }
}
