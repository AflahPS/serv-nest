import { ForbiddenException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from 'src/user/user.service';
import { thrower } from 'src/utils';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private userService: UserService) {
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
    try {
      const { user } = await this.userService.findUserById(payload.sub);
      if (user) {
        const isVerified = user.password === payload.password;
        if (!isVerified) throw new ForbiddenException('Unauthorized !');
        return user;
      }
      return null;
    } catch (err) {
      thrower(err);
    }
  }
}
