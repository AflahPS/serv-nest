import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { signinDto, signupDto } from './dto';
import { UserService } from 'src/user/user.service';
import mongoose from 'mongoose';

@Injectable()
export class AuthService {
  constructor(private jwt: JwtService, private userService: UserService) {}

  async signToken(id: string | mongoose.Schema.Types.ObjectId, email: string) {
    const payload = { sub: id, email };
    return await this.jwt.signAsync(payload, {
      expiresIn: '120m',
      secret: process.env.JWT_SECRET,
    });
  }

  async signup(dto: signupDto) {
    console.log({ dto });
    const newUser = await this.userService.addUser(dto);
    return await this.signToken(newUser._id, newUser.email);
  }

  async signin(dto: signinDto) {
    const user = await this.userService.findUserByEmail({ email: dto.email });
    return await this.signToken(user._id, user.email);
  }
}
