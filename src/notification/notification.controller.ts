import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { JwtGuard } from 'src/auth/guard';
import { Create } from './dto/Create.dto';
import { GetUser } from 'src/auth/decorator';
import { User } from 'src/user/user.model';
import { MongoId } from 'src/utils';

@Controller('api/v1/notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @UseGuards(JwtGuard)
  @Post()
  createNotification(@Body() dto: Create, @GetUser() user: User) {
    dto.author = user._id.toString();
    return this.notificationService.createNotification(dto);
  }

  @UseGuards(JwtGuard)
  @Get()
  getNotifications(@GetUser() user: User) {
    return this.notificationService.getNotifications(user._id);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  deleteNotification(@Param() params: MongoId, @GetUser() user: User) {
    return this.notificationService.deleteNotification(
      params.id,
      user._id.toString(),
    );
  }
}
