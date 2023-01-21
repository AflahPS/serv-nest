import { ForbiddenException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from 'src/user/user.service';
import { VendorService } from 'src/vendor/vendor.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private userService: UserService,
    private vendorService: VendorService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: {
    sub: string;
    email: string;
    password: string;
    iat: number;
    exp: string;
  }) {
    let user;
    try {
      user = await this.userService.findUserById(payload.sub);
    } catch (err) {}

    if (!user) {
      try {
        user = await this.vendorService.findVendorById(payload.sub);
      } catch (err) {}
    }

    if (user) {
      const isVerified = user.password === payload.password;
      if (!isVerified) throw new ForbiddenException('Unauthorized');
      return user;
    }
    return null;
  }
}
