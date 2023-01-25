import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { SignupDto } from 'src/auth/dto';
import { JwtGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator';
import { User } from './user.model';
import { Edit, Image } from './dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  insertUser(@Body() dto: SignupDto) {
    return this.userService.addUser(dto);
  }

  @UseGuards(JwtGuard)
  @Patch('/personal')
  editUser(@Body() dto: Edit, @GetUser() user: User) {
    return this.userService.updateUserData(dto, user);
  }

  @UseGuards(JwtGuard)
  @Patch('/image')
  changeImage(@Body() dto: Image, @GetUser() user: User) {
    console.log(
      '🚀 ~ file: user.controller.ts:35 ~ UserController ~ changeImage ~ dto',
      dto,
    );
    return this.userService.updateUserData(dto, user);
  }

  @UseGuards(JwtGuard)
  @Get('all')
  getAllUsers() {
    return this.userService.findAllUsers();
  }

  @Get('single/:id')
  getSingleUser(@Param() params: { id: string }) {
    return this.userService.findUserById(params.id);
  }

  @UseGuards(JwtGuard)
  @Get('me')
  getMe(@GetUser() user: User) {
    return user;
  }
}
