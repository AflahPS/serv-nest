import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import mongoose from 'mongoose';

import { SigninDto, SignupDto, SignupVendor } from './dto';
import { UserService } from 'src/user/user.service';
import { VendorService } from 'src/vendor/vendor.service';
import { Newbie } from 'src/user/user.model';
import { Vendor } from 'src/vendor/vendor.model';
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
      return { status: 'success', token };
    } catch (err: any) {
      thrower(err);
    }
  }

  async signup(dto: SignupDto) {
    try {
      const newUser = await this.userService.addUser(dto);
      return await this.signToken(newUser._id, newUser.email, newUser.password);
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
      return await this.signToken(user._id, user.email, user.password);
    } catch (err) {
      thrower(err);
    }
  }

  async signupVendor(dto: SignupVendor, user: Newbie) {
    const combined: Vendor = {
      ...dto,
      name: user.name,
      email: user.email,
      password: user.password,
    };
    try {
      const newVendor = await this.vendorService.addVendor(combined);
      await this.userService.findByIdAndDelete(user._id);
      return await this.signToken(
        newVendor._id,
        newVendor.email,
        newVendor.password,
      );
    } catch (err: any) {
      thrower(err);
    }
  }

  async signinVendor(dto: SigninDto) {
    try {
      const vendor = await this.vendorService.findVendorByEmail({
        email: dto.email,
      });
      const isVerified = await this.userService.verifyUser(
        dto.password,
        vendor.password,
      );
      if (!isVerified) throw new NotFoundException('Email/password wrong !');
      return await this.signToken(vendor._id, vendor.email, vendor.password);
    } catch (err: any) {
      thrower(err);
    }
  }
}
