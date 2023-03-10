import {
  ForbiddenException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Appointment } from './appointment.model';
import { Create } from './dto/Create.dto';
import {
  ObjId,
  lastWeekMade,
  monthlyMade,
  returnNotFound,
  thrower,
} from 'src/utils';
import { UserService } from 'src/user/user.service';
import { Edit } from './dto/Edit.dto';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectModel('Appointment') private readonly appoModel: Model<Appointment>,
    private readonly userService: UserService,
  ) {}

  async createAppointment(dto: Create) {
    try {
      if (dto.vendor.toString() === dto.user.toString()) {
        throw new NotAcceptableException(
          'Vendor should not hire his own services !, (vendor ID and user ID must be different)',
        );
      }
      if (!(await this.userService.checkIfVendor(dto.vendor))) {
        throw new ForbiddenException('Only vendors can accept appointments !');
      }
      const prepData = new this.appoModel(dto);
      const newAppointment = await prepData.save();
      return { status: 'success', appointment: newAppointment };
    } catch (err) {
      thrower(err);
    }
  }

  async getAppointmentsForVendor(vendorId: string | ObjId) {
    try {
      const appointments = await this.appoModel
        .find({ vendor: vendorId })
        .populate({
          path: 'user',
          select: '-password -__v -isBanned',
        });
      if (!appointments || !appointments.length)
        throw new NotFoundException('No documents found !');

      return { status: 'success', appointments, results: appointments.length };
    } catch (err) {
      const retObj = returnNotFound(err, 'appointments', true);
      if (retObj) return retObj;
      thrower(err);
    }
  }

  async getAppointmentsForUser(userId: string | ObjId) {
    try {
      const appointments = await this.appoModel
        .find({ user: userId })
        .populate({
          path: 'vendor',
          select: '-password -__v -isBanned',
        });
      if (!appointments || !appointments.length)
        throw new NotFoundException('No documents found !');

      return { status: 'success', appointments, results: appointments.length };
    } catch (err) {
      const retObj = returnNotFound(err, 'appointments', true);
      if (retObj) return retObj;
      thrower(err);
    }
  }

  async changeStatus(
    appoId: string | ObjId,
    status: string,
    vendorId: string | ObjId,
  ) {
    try {
      const appointment = await this.appoModel.findById(appoId);
      if (!appointment) throw new NotFoundException('Document not found !');
      if (appointment.vendor.toString() !== vendorId.toString()) {
        throw new ForbiddenException(
          'You are not allowed to perform this action !',
        );
      }
      appointment.status = status;
      const updated = await appointment.save();
      return { status: 'success', appointment: updated };
    } catch (err) {
      thrower(err);
    }
  }

  async editStatus(appoId: string | ObjId, dto: Edit, userId: string | ObjId) {
    try {
      const appointment = await this.appoModel.findById(appoId);
      if (!appointment) throw new NotFoundException('Document not found !');
      if (appointment.user.toString() !== userId.toString()) {
        throw new ForbiddenException(
          'You are not allowed to perform this action !',
        );
      }
      appointment.date = dto.date as Date;
      appointment.description = dto.description;
      const updated = await appointment.save();
      await updated.populate({
        path: 'vendor',
        select: '-password -__v -isBanned',
      });
      return { status: 'success', appointment: updated };
    } catch (err) {
      thrower(err);
    }
  }

  async changeDate(
    appoId: string | ObjId,
    date: string,
    vendorId: string | ObjId,
  ) {
    try {
      const appointment = await this.appoModel.findById(appoId);
      if (!appointment) throw new NotFoundException('Document not found !');
      if (appointment.vendor.toString() !== vendorId.toString()) {
        throw new ForbiddenException(
          'You are not allowed to perform this action !',
        );
      }
      const formatedDate = new Date(date);
      appointment.date = formatedDate;
      const updated = await appointment.save();
      return { status: 'success', appointment: updated };
    } catch (err) {
      thrower(err);
    }
  }

  async deleteAppointment(appoId: string, userId: string | ObjId) {
    try {
      const appointment = await this.appoModel.findById(appoId);
      if (!appointment) throw new NotFoundException('Document not found !');
      if (appointment.user.toString() !== userId.toString())
        throw new ForbiddenException(
          'User not authorized to perform this operation !',
        );
      await appointment.remove();
      return { status: 'success' };
    } catch (err) {
      thrower(err);
    }
  }

  async getLastWeekAppointments() {
    try {
      return await lastWeekMade(this.appoModel);
    } catch (err) {
      thrower(err);
    }
  }

  async getMonthlyAppointments() {
    try {
      return await monthlyMade(this.appoModel);
    } catch (err) {
      thrower(err);
    }
  }
}
