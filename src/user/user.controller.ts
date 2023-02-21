import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  NotAcceptableException,
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
import { Edit, Image, RoleChange } from './dto';
import { MongoId, ObjId, returner } from 'src/utils';
import { checkIfAdmin } from 'src/utils/util.functions';

@Controller('api/v1/user')
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
  getSingleUser(@Param() params: MongoId) {
    return this.userService.findUserById(params.id);
  }

  @Get('search/:key')
  searchUser(@Param() params: { key: string }) {
    return this.userService.findUserByKey(params.key);
  }

  @UseGuards(JwtGuard)
  @Get('me')
  getMe(@GetUser() user: User) {
    return returner({ user });
  }

  @UseGuards(JwtGuard)
  @Get('/admin/me')
  getMeAdmin(@GetUser() user: User) {
    if (!checkIfAdmin(user))
      throw new ForbiddenException(`You are unauthorized to access this page`);
    return returner({ user });
  }

  @UseGuards(JwtGuard)
  @Patch('/role')
  roleChanger(@GetUser() user: User, @Body() dto: RoleChange) {
    if (!checkIfAdmin(user))
      throw new ForbiddenException(`You are unauthorized to access this page`);
    if (dto.from === dto.to)
      throw new NotAcceptableException(
        'Promoted/Demoted roles should not be the same !',
      );
    return this.userService.roleChanger(dto);
  }

  @UseGuards(JwtGuard)
  @Get('followers/vendor')
  getVendorFollowers(@GetUser() user: User) {
    return this.userService.getVendorFollowers(user);
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

  @UseGuards(JwtGuard)
  @Post('save-post/:id')
  addPostToSaved(@GetUser() user: User, @Param() params: MongoId) {
    return this.userService.addPostToSaved(user._id as ObjId, params.id);
  }

  @UseGuards(JwtGuard)
  @Delete('save-post/:id')
  removePostFromSaved(@GetUser() user: User, @Param() params: MongoId) {
    return this.userService.removePostFromSaved(user._id as ObjId, params.id);
  }

  @UseGuards(JwtGuard)
  @Get('save-post')
  getSavedPost(@GetUser() user: User) {
    return this.userService.getSavedPost(user._id as ObjId);
  }

  @UseGuards(JwtGuard)
  @Get('/role/:role')
  findUserByRole(@GetUser() user: User, @Param('role') role: string) {
    if (!checkIfAdmin(user))
      throw new ForbiddenException('Unauthorized user !');

    return this.userService.findUserByRole(role);
  }

  @UseGuards(JwtGuard)
  @Patch('ban/:id')
  banUser(@GetUser() user: User, @Param() params: MongoId) {
    if (!checkIfAdmin(user))
      throw new ForbiddenException('Unauthorized user !');
    return this.userService.banUser(params.id);
  }

  @UseGuards(JwtGuard)
  @Patch('unban/:id')
  unbanUser(@GetUser() user: User, @Param() params: MongoId) {
    if (!checkIfAdmin(user))
      throw new ForbiddenException('Unauthorized user !');
    return this.userService.unbanUser(params.id);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  deleteUser(@GetUser() user: User, @Param() params: MongoId) {
    if (!checkIfAdmin(user))
      throw new ForbiddenException('Unauthorized user !');
    return this.userService.deleteUser(params.id);
  }

  @UseGuards(JwtGuard)
  @Get('weekly')
  getLastWeekUsers(@GetUser() user: User) {
    checkIfAdmin(user);
    return this.userService.getLastWeekUsers();
  }

  @UseGuards(JwtGuard)
  @Get('monthly')
  getMonthlyUsers(@GetUser() user: User) {
    checkIfAdmin(user);
    return this.userService.getMonthlyUsers();
  }
}
