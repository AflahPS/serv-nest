import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninDto, SigninProviderDto, SignupDto, SignupVendor } from './dto';
import { GetUser } from './decorator';
import { Newbie } from 'src/user/user.model';
import { JwtGuard } from './guard';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // NORMAL-USER:
  @Post('signup')
  signup(@Body() dto: SignupDto) {
    return this.authService.signup(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  signin(@Body() dto: SigninDto) {
    return this.authService.signin(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('signin/provider')
  signinWithProvider(@Body() dto: SigninProviderDto) {
    return this.authService.signinProvider(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('signin/admin')
  signinAdmin(@Body() dto: SigninDto) {
    return this.authService.signinAdmin(dto);
  }

  @Post('signout')
  signout() {
    return { status: 'success', token: null };
  }

  // VENDOR:
  @UseGuards(JwtGuard)
  @Post('signup/vendor')
  signupVendor(@Body() dto: SignupVendor, @GetUser() user: Newbie) {
    return this.authService.signupVendor(dto, user);
  }

  // @HttpCode(HttpStatus.OK)
  // @Post('signin/vendor')
  // signinVendor(@Body() dto: SigninDto) {
  //   return this.authService.signinVendor(dto);
  // }
}
