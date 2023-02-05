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
import { MongoId } from 'src/utils';

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

  @Get('search/:key')
  searchUser(@Param() params: { key: string }) {
    return this.userService.findUserByKey(params.key);
  }

  @UseGuards(JwtGuard)
  @Get('me')
  getMe(@GetUser() user: User) {
    return user;
  }

  @Get('followers/:id')
  getFollowers(@Param() params: MongoId) {
    return this.userService.getFollowers(params.id);
  }

  @UseGuards(JwtGuard)
  @Patch('follow/:id')
  follow(@GetUser() user: User, @Param() params: MongoId) {
    return this.userService.follow(user._id, params.id);
  }

  @UseGuards(JwtGuard)
  @Patch('unfollow/:id')
  unfollow(@GetUser() user: User, @Param() params: MongoId) {
    return this.userService.unfollow(user._id, params.id);
  }
}
