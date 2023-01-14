import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { signinDto, signupDto, signupVendor } from './dto';
import { GetUser } from './decorator';
import { Newbie } from 'src/user/user.model';
import { JwtGuard } from './guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // NORMAL-USER:
  @Post('signup')
  signup(@Body() dto: signupDto) {
    return this.authService.signup(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  signin(@Body() dto: signinDto) {
    return this.authService.signin(dto);
  }

  @Post('signout')
  signout() {
    return { status: 'success', token: null };
  }

  // VENDOR:
  @UseGuards(JwtGuard)
  @Post('signup/vendor')
  signupVendor(@Body() dto: signupVendor, @GetUser() user: Newbie) {
    console.log({ user });
    return this.authService.signupVendor(dto, user);
  }

  @HttpCode(HttpStatus.OK)
  @Post('signin/vendor')
  signinVendor(@Body() dto: signinDto) {
    return this.authService.signinVendor(dto);
  }
}
