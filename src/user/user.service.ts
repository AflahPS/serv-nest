import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as argon from 'argon2';

import { Newbie, User } from './user.model';
import { SignupDto } from 'src/auth/dto';
import { ObjId, thrower } from 'src/utils';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async addUser(dto: SignupDto): Promise<Newbie> {
    // Hashing the user password
    const hashed = await argon.hash(dto.password);
    dto.password = hashed;

    // Saving the user to the database
    const newUser = new this.userModel(dto);
    const addedUser = await newUser.save();

    return addedUser;
  }

  async verifyUser(password: string, hashedPassword: string): Promise<boolean> {
    return await argon.verify(hashedPassword, password);
  }

  async findUserById(id: string | ObjId) {
    try {
      let user = await this.userModel
        .findById(id, { __v: 0 })
        .populate('vendor');
      if (
        'vendor' in user &&
        typeof user.vendor === 'object' &&
        'service' in user.vendor
      ) {
        user = await user.populate('vendor.service');
      }
      if (!user) throw new NotFoundException('Could not find user');
      delete user.password;
      return { status: 'success', user };
    } catch (err) {
      throw new NotFoundException(err.message || 'Something went wrong');
    }
  }

  async findUserByEmail(obj: { email: string }) {
    try {
      // TODO: check if the `error message =
      //  "Cannot read properties of null (reading 'role')"
      // ` is gone after purging the db

      let user = await this.userModel.findOne(obj, { __v: 0 }).populate({
        path: 'vendor',
        model: 'Vendor',
      });

      if (
        'vendor' in user &&
        typeof user.vendor === 'object' &&
        'service' in user.vendor
      ) {
        user = await user.populate('vendor.service');
      }

      // await user.populate('vendor.service');

      if (!user) throw new ForbiddenException('Email/password is wrong !!');
      delete user.password;
      return user;
    } catch (err) {
      thrower(err);
    }
  }

  async findByIdAndDelete(id: string | ObjId) {
    try {
      await this.userModel.findByIdAndDelete(id);
    } catch (err) {
      thrower(err);
    }
  }

  async findByIdAndUpdate(id: string | ObjId, payload: any) {
    try {
      const updatedUser = await this.userModel
        .findByIdAndUpdate(id, payload, {
          new: true,
          runValidators: true,
        })
        .populate('vendor');

      await updatedUser.populate('vendor.service');
      return updatedUser;
    } catch (err) {
      thrower(err);
    }
  }

  async findAllUsers(): Promise<User[]> {
    const users = await this.userModel.find({}, { __v: 0, password: 0 }).exec();
    return users;
  }

  async updateUserData(dto: any, user: User) {
    try {
      const prepData = Object.assign(user, dto);
      let updatedUser = await this.userModel
        .findByIdAndUpdate(prepData._id, prepData, {
          new: true,
          runValidators: true,
        })
        .populate('vendor');

      if (
        'vendor' in updatedUser &&
        typeof updatedUser.vendor === 'object' &&
        'service' in updatedUser.vendor
      ) {
        updatedUser = await updatedUser.populate('vendor.service');
      }

      delete updatedUser.password;
      return { status: 'success', user: updatedUser };
    } catch (err) {
      thrower(err);
    }
  }

  async makeVendor(userId: string | ObjId, vendorId: string | ObjId) {
    try {
      let updatedUser = await this.userModel
        .findByIdAndUpdate(
          userId,
          {
            role: 'vendor',
            vendor: vendorId,
          },
          {
            new: true,
            runValidators: true,
          },
        )
        .populate('vendor');

      updatedUser = await updatedUser.populate('vendor.service');
      // delete updatedUser.password;
      return updatedUser;
    } catch (err) {
      thrower(err);
    }
  }
}
