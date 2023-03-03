import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from 'src/user/user.service';
import { thrower } from 'src/utils';

interface Payload {
  sub: string;
  email: string;
  iat: number;
  exp: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: Payload) {
    try {
      // Check if token expired
      const now = new Date().getTime() / 1000;
      if (now > +payload.exp)
        throw new UnauthorizedException('Your token is expired, Login again !');
      // Check if user exists or banned
      const { user } = await this.userService.findUserById(payload.sub);
      if (user) {
        if (user.email !== payload.email)
          throw new ForbiddenException('Unauthorized !');
        if (user.isBanned)
          throw new ForbiddenException('You account has been banned !');
        return user;
      }
      return null;
    } catch (err) {
      thrower(err);
    }
  }
}
