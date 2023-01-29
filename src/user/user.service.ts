import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import * as argon from 'argon2';

import { Newbie, User } from './user.model';
import { SignupDto } from 'src/auth/dto';
import { thrower } from 'src/utils';

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

  async findUserById(id: string): Promise<User> {
    let user: User;
    try {
      user = await this.userModel.findById(id, { __v: 0 }).exec();
    } catch (err) {
      throw new NotFoundException(err.message || 'Something went wrong');
    }
    if (!user) throw new NotFoundException('Could not find user');
    delete user.password;
    return user;
  }

  async findUserByEmail(obj: { email: string }): Promise<User> {
    let user: User;
    try {
      user = await this.userModel.findOne(obj, { __v: 0 }).exec();
    } catch (err) {
      throw new NotFoundException(err.message || 'Something went wrong');
    }
    if (!user) throw new ForbiddenException('Email/password is wrong !!');
    delete user.password;
    return user;
  }

  async findByIdAndDelete(id: string | mongoose.Schema.Types.ObjectId) {
    try {
      await this.userModel.findByIdAndDelete(id);
    } catch (err) {
      thrower(err);
    }
  }

  async findByIdAndUpdate(
    id: string | mongoose.Schema.Types.ObjectId,
    payload: any,
  ) {
    try {
      const updatedUser = await this.userModel.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
      });
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
      const updatedUser = await this.userModel.findByIdAndUpdate(
        prepData._id,
        prepData,
        { new: true, runValidators: true },
      );
      delete updatedUser.password;
      return { status: 'success', user: updatedUser };
    } catch (err) {
      thrower(err);
    }
  }
}
