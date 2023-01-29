import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import mongoose from 'mongoose';

import { SigninDto, SignupDto, SignupVendor } from './dto';
import { UserService } from 'src/user/user.service';
import { VendorService } from 'src/vendor/vendor.service';
import { Newbie, User } from 'src/user/user.model';
import { thrower } from 'src/utils';

@Injectable()
export class AuthService {
  constructor(
    private jwt: JwtService,
    private userService: UserService,
    private vendorService: VendorService,
  ) {}

  async signToken(
    id: string | mongoose.Schema.Types.ObjectId,
    email: string,
    password: string,
  ) {
    const payload = { sub: id, email, password };
    try {
      const token = await this.jwt.signAsync(payload, {
        expiresIn: '120m',
        secret: process.env.JWT_SECRET,
      });
      return token;
    } catch (err: any) {
      thrower(err);
    }
  }

  async signup(dto: SignupDto) {
    try {
      Object.assign(dto, { role: 'user' });
      const newUser = await this.userService.addUser(dto);
      const token = await this.signToken(
        newUser._id,
        newUser.email,
        newUser.password,
      );
      delete newUser.password;
      return { status: 'success', token, user: newUser };
    } catch (err: any) {
      thrower(err);
    }
  }

  async signin(dto: SigninDto) {
    try {
      const user = await this.userService.findUserByEmail({ email: dto.email });
      const isVerified = await this.userService.verifyUser(
        dto.password,
        user.password,
      );
      if (!isVerified) throw new NotFoundException('Email/password wrong !');
      const token = await this.signToken(user._id, user.email, user.password);
      delete user.password;
      return { status: 'success', token, user };
    } catch (err) {
      thrower(err);
    }
  }

  async signupVendor(dto: SignupVendor, user: Newbie | User) {
    try {
      dto.user = user._id;
      const newVendor = await this.vendorService.addVendor(dto);
      const updatedUser = await this.userService.findByIdAndUpdate(user._id, {
        role: 'vendor',
        vendor: newVendor._id,
      });
      const token = await this.signToken(
        updatedUser._id,
        updatedUser.email,
        updatedUser.password,
      );
      delete updatedUser.password;
      return { status: 'success', token, user: newVendor };
    } catch (err: any) {
      thrower(err);
    }
  }

  // async signinVendor(dto: SigninDto) {
  //   try {
  //     const vendor = await this.userService.({
  //       email: dto.email,
  //     });
  //     const isVerified = await this.userService.verifyUser(
  //       dto.password,
  //       vendor.password,
  //     );
  //     if (!isVerified) throw new NotFoundException('Email/password wrong !');
  //     const token = await this.signToken(
  //       vendor._id,
  //       vendor.email,
  //       vendor.password,
  //     );
  //     delete vendor.password;
  //     return { status: 'success', token, user: vendor };
  //   } catch (err: any) {
  //     thrower(err);
  //   }
  // }
}
