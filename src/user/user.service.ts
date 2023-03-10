import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as argon from 'argon2';
import { User } from './user.model';
import { SigninProviderDto, SignupDto, SignupVendor } from 'src/auth/dto';
import { ObjId, lastWeekMade, monthlyMade, returner, thrower } from 'src/utils';
import { RoleChange } from './dto';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async verifyUser(password: string, hashedPassword: string): Promise<boolean> {
    try {
      return await argon.verify(hashedPassword, password);
    } catch (err) {
      thrower(err);
    }
  }

  async addUser(dto: SignupDto) {
    try {
      // Hashing the user password
      const hashed = await argon.hash(dto.password);
      dto.password = hashed;

      // Saving the user to the database
      const newUser = new this.userModel(dto);
      const addedUser = await newUser.save();
      delete addedUser['password'];
      return addedUser;
    } catch (err) {
      thrower(err);
    }
  }

  async providerSignup(dto: SigninProviderDto) {
    try {
      // Saving the user to the database
      const newUser = new this.userModel({
        name: dto.name,
        email: dto.email,
        image: dto?.image || '',
        phone: dto?.phone || '',
        authType: dto.provider,
      });
      const addedUser = await newUser.save();
      return addedUser;
    } catch (err) {
      thrower(err);
    }
  }

  async findUserById(id: string | ObjId) {
    try {
      let user = await this.userModel
        .findById(id, { __v: 0, password: 0 })
        .populate('vendor');
      if (!user) throw new NotFoundException('Email or Password wrong !');
      if (!user?.role || user.role === 'user') return returner({ user });
      if (['admin', 'super-admin'].some((role) => role === user.role))
        return returner({ user });
      if (
        'vendor' in user &&
        typeof user.vendor === 'object' &&
        'service' in user.vendor
      ) {
        user = await user.populate('vendor.service');
      }

      return returner({ user });
    } catch (err) {
      thrower(err);
    }
  }

  async findUserByRole(role: string) {
    try {
      const users = await this.userModel
        .find({ role })
        .select('-password')
        .populate([
          {
            path: 'vendor',
            strictPopulate: false,
          },
        ]);

      return returner({ results: users.length, users });
    } catch (err) {
      thrower(err);
    }
  }

  async findUserByEmail(obj: { email: string }) {
    try {
      let user = await this.userModel.findOne(obj, { __v: 0 }).populate([
        {
          path: 'vendor',
          strictPopulate: false,
        },
      ]);
      if (!user) throw new NotFoundException('Email or Password wrong !');
      if (!user?.role || user.role === 'user') return user;
      if (['admin', 'super-admin'].some((el) => el === user.role)) return user;
      if (
        'vendor' in user &&
        typeof user.vendor === 'object' &&
        'service' in user.vendor
      ) {
        user = await user.populate('vendor.service');
      }
      return user;
    } catch (err) {
      thrower(err);
    }
  }

  async findUserByEmailForProviderAuth(obj: { email: string }) {
    try {
      let user;
      try {
        user = await this.userModel.findOne(obj, { __v: 0 }).populate([
          {
            path: 'vendor',
            strictPopulate: false,
          },
        ]);
      } catch (error) {
        console.error(error);
        return null;
      }
      if (!user) return null;
      if (!user?.role || user.role === 'user') return user;
      if (['admin', 'super-admin'].some((el) => el === user.role)) return user;
      if (
        'vendor' in user &&
        typeof user.vendor === 'object' &&
        'service' in user.vendor
      ) {
        user = await user.populate('vendor.service');
      }

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
    try {
      const users = await this.userModel
        .find({}, { __v: 0, password: 0 })
        .exec();
      return users;
    } catch (err) {
      thrower(err);
    }
  }

  async getVendorFollowers(user: User) {
    try {
      const userWithFollowers = await this.userModel
        .findById(user._id)
        .populate({
          path: 'followers',
          select: '-password',
          populate: {
            path: 'vendor',
            strictPopulate: false,
          },
        });
      const vendorFollowers = userWithFollowers.followers.filter(
        (u) => (u as User)?.role === 'vendor',
      );
      return {
        status: 'success',
        results: vendorFollowers.length,
        users: vendorFollowers,
      };
    } catch (err) {
      thrower(err);
    }
  }

  findVendorByService = async (vendorIds: ObjId[]) => {
    try {
      const users = await this.userModel
        .find({ vendor: { $in: vendorIds } }, { password: 0 })
        .populate('vendor');
      return returner({ results: users.length, users });
    } catch (err) {
      thrower(err);
    }
  };

  findVendorByServiceWithDistance = async (
    vendorIds: ObjId[],
    lnglat: string,
  ) => {
    try {
      const center: { type: 'Point'; coordinates: [number, number] } = {
        type: 'Point',
        coordinates: [+lnglat.split(',')[0], +lnglat.split(',')[1]],
      };
      const users = await this.userModel.aggregate([
        {
          $geoNear: {
            near: center,
            distanceField: 'distance',
            query: {
              vendor: {
                $in: vendorIds,
              },
            },
          },
        },
        {
          $lookup: {
            from: 'vendors',
            localField: 'vendor',
            foreignField: '_id',
            as: 'vendorArr',
          },
        },
        {
          $addFields: {
            vendor: {
              $arrayElemAt: ['$vendorArr', 0],
            },
          },
        },
        {
          $project: {
            vendorArr: 0,
            password: 0,
          },
        },
      ]);
      // .populate('vendor');
      return returner({ results: users.length, users });
    } catch (err) {
      thrower(err);
    }
  };

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

  async makeVendor(
    userId: string | ObjId,
    vendorId: string | ObjId,
    dto: SignupVendor,
  ) {
    try {
      let updatedUser = await this.userModel
        .findByIdAndUpdate(
          userId,
          {
            role: 'vendor',
            vendor: vendorId,
            place: dto?.place,
            location: dto?.location,
          },
          {
            new: true,
            runValidators: true,
          },
        )
        .populate('vendor');

      updatedUser = await updatedUser.populate('vendor.service');

      return updatedUser;
    } catch (err) {
      thrower(err);
    }
  }

  async roleChanger(dto: RoleChange) {
    try {
      const user = await this.userModel.findById(dto.id);
      if (!user) throw new NotFoundException(`User with ${dto.id} not found !`);
      if (user?.role !== dto.from)
        throw new ConflictException(
          "It seems like the user's data (user.role) is out-of-sync !",
        );
      user.role = dto.to;
      const updatedUser = (await user.save()).toObject();
      delete updatedUser.password;
      if (updatedUser.role === dto.to) return returner({ user: updatedUser });
      else
        throw new InternalServerErrorException('Could not change the role !');
    } catch (err) {
      thrower(err);
    }
  }

  async checkIfVendor(userId: string | ObjId) {
    try {
      const user = await this.userModel.findById(userId);
      return user?.role === 'vendor';
    } catch (err) {
      thrower(err);
    }
  }

  async findUserByKey(key: string) {
    try {
      const pattern = new RegExp(key, 'g');
      const users = await this.userModel
        .find({
          name: { $regex: pattern },
        })
        .select('name email image');
      return { status: 'success', users };
    } catch (err) {
      thrower(err);
    }
  }

  async follow(userId: string | ObjId, followerId: string) {
    try {
      const user = await this.userModel.findByIdAndUpdate(
        userId,
        {
          $addToSet: { followers: followerId },
        },
        {
          new: true,
          runValidators: true,
        },
      );
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const followee = await this.userModel.findByIdAndUpdate(
        followerId,
        {
          $addToSet: { followers: userId },
        },
        {
          runValidators: true,
        },
      );
      return { status: 'success', user };
    } catch (err) {
      thrower(err);
    }
  }

  async unfollow(userId: string | ObjId, followerId: string) {
    try {
      const user = await this.userModel.findByIdAndUpdate(
        userId,
        {
          $pull: { followers: followerId },
        },
        {
          new: true,
          runValidators: true,
        },
      );
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const unfollowee = await this.userModel.findByIdAndUpdate(
        followerId,
        {
          $pull: { followers: userId },
        },
        {
          runValidators: true,
        },
      );
      return { status: 'success', user };
    } catch (err) {
      thrower(err);
    }
  }

  async getFollowers(userId: string) {
    const userData = await this.userModel.findById(userId).populate({
      path: 'followers',
      select: 'name image email followers ',
    });
    return {
      status: 'success',
      results: userData.followers.length,
      followers: userData.followers,
    };
  }

  async addPostToSaved(userId: ObjId, postId: string) {
    try {
      const user = await this.userModel.findByIdAndUpdate(
        userId,
        {
          $addToSet: { savedPosts: postId },
        },
        {
          new: true,
          runValidators: true,
        },
      );
      if (user) return returner();
    } catch (err) {
      thrower(err);
    }
  }

  async removePostFromSaved(userId: ObjId, postId: string) {
    try {
      const user = await this.userModel.findByIdAndUpdate(
        userId,
        {
          $pull: { savedPosts: postId },
        },
        {
          new: true,
          runValidators: true,
        },
      );
      if (user) return returner();
    } catch (err) {
      thrower(err);
    }
  }

  async getSavedPost(userId: ObjId) {
    try {
      const user = await this.userModel
        .findById(userId)
        .populate({
          path: 'savedPosts',
          populate: { path: 'owner', select: 'name image createdAt updatedAt' },
        })
        .select('savedPosts');
      return returner({ user });
    } catch (err) {
      thrower(err);
    }
  }

  async banUser(userId: string) {
    try {
      const user = await this.userModel.findByIdAndUpdate(
        userId,
        {
          isBanned: true,
        },
        {
          new: true,
          runValidators: true,
        },
      );
      if (user.isBanned) return returner();
      return { status: 'failed' };
    } catch (err) {
      thrower(err);
    }
  }

  async unbanUser(userId: string) {
    try {
      const user = await this.userModel.findByIdAndUpdate(
        userId,
        {
          isBanned: false,
        },
        {
          new: true,
          runValidators: true,
        },
      );
      if (!user.isBanned) return returner();
      return { status: 'failed' };
    } catch (err) {
      thrower(err);
    }
  }

  async deleteUser(userId: string) {
    try {
      const res = await this.userModel.findByIdAndDelete(userId);
      if (res) return returner();
      return { status: 'failed' };
    } catch (err) {
      thrower(err);
    }
  }

  async getLastWeekUsers() {
    try {
      return await lastWeekMade(this.userModel);
    } catch (err) {
      thrower(err);
    }
  }

  async getMonthlyUsers() {
    try {
      return await monthlyMade(this.userModel);
    } catch (err) {
      thrower(err);
    }
  }
}
