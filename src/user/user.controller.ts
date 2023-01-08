import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { signupDto } from 'src/auth/dto';
import { JwtGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator';
import { User } from './user.model';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  insertUser(@Body() dto: signupDto) {
    return this.userService.addUser(dto);
  }

  @UseGuards(JwtGuard)
  @Get('all')
  getAllUsers() {
    return this.userService.findAllUsers();
  }

  @Get('single/:id')
  getSingleUser(@Param() params) {
    return this.userService.findUserById(params.id);
  }

  @UseGuards(JwtGuard)
  @Get('me')
  getMe(@GetUser() user: User) {
    return user;
  }
}
