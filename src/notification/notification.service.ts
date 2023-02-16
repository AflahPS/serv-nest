import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification } from './notification.model';
import { ObjId, returner, thrower } from 'src/utils';
import { Create } from './dto/Create.dto';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel('Notification')
    private readonly notificationModel: Model<Notification>,
  ) {}

  async createNotification(dto: Create) {
    try {
      const prepData = new this.notificationModel(dto);
      const newNotification = await prepData.save();
      return returner({ notification: newNotification });
    } catch (err) {
      thrower(err);
    }
  }
  async getNotifications(userId: string | ObjId) {
    try {
      const notifications = await this.notificationModel
        .find({
          receiver: userId,
        })
        .sort('-createdAt');
      return returner({ results: notifications.length, notifications });
    } catch (err) {
      thrower(err);
    }
  }
  async deleteNotification(notificationId: string, userId: string) {
    try {
      const notification = await this.notificationModel.findById(
        notificationId,
      );
      if (!notification) throw new NotFoundException('Document not found !');
      if (notification.receiver.toString() !== userId)
        throw new ForbiddenException('Unauthorized to perform this action !');
      const res = await notification.remove();
      if (res) return returner();
    } catch (err) {
      thrower(err);
    }
  }
}
