import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { PostService } from './post.service';
import { Create, Edit, PaginationParams } from './dto';
import { JwtGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator';
import { MongoId, ObjId, thrower } from 'src/utils';
import { Vendor } from 'src/vendor/vendor.model';
import { User } from 'src/user/user.model';
import { checkIfAdmin } from 'src/utils/util.functions';

@Controller('api/v1/post')
export class PostController {
  constructor(private postService: PostService) {}

  @UseGuards(JwtGuard)
  @Post()
  async createPost(
    @Body()
    dto: Create,
    @GetUser('_id') id: ObjId | string,
  ) {
    dto.owner = id;

    try {
      return await this.postService.createPost(dto);
    } catch (err) {
      thrower(err);
    }
  }

  @Get('all')
  @UseGuards(JwtGuard)
  async getAllPosts(@GetUser() user: User) {
    try {
      if (!checkIfAdmin(user))
        throw new ForbiddenException('Unauthorized access is not allowed');
      return await this.postService.getAllPosts();
    } catch (err) {
      thrower(err);
    }
  }

  @Get('/:id')
  async getPostById(@Param() params: MongoId) {
    try {
      return await this.postService.getPostById(params.id);
    } catch (err) {
      thrower(err);
    }
  }

  @Get(`/page/:page/limit/:limit`)
  async getPostForGuest(@Param() params: PaginationParams) {
    try {
      return await this.postService.getPostForGuest(params);
    } catch (err) {
      thrower(err);
    }
  }

  @Get('/owner/:id/page/:page/limit/:limit')
  async getPostByUser(@Param() params: PaginationParams) {
    try {
      return await this.postService.getPostByUserId(params);
    } catch (err) {
      thrower(err);
    }
  }

  @UseGuards(JwtGuard)
  @Get('user/page/:page/limit/:limit')
  async getPostForUser(
    @GetUser() user: User | Vendor,
    @Param() params: PaginationParams,
  ) {
    try {
      return await this.postService.getPostForUser(user._id, params);
    } catch (err) {
      thrower(err);
    }
  }

  @UseGuards(JwtGuard)
  @Get('saved/page/:page/limit/:limit')
  async getSavedPosts(
    @GetUser() user: User,
    @Param() params: PaginationParams,
  ) {
    try {
      return await this.postService.getSavedPosts(
        user.savedPosts as string[],
        params,
      );
    } catch (err) {
      thrower(err);
    }
  }

  @UseGuards(JwtGuard)
  @Get('weekly')
  getLastWeekPosts(@GetUser() user: User) {
    checkIfAdmin(user);
    return this.postService.getLastWeekPosts();
  }

  @UseGuards(JwtGuard)
  @Get('monthly')
  getMonthlyPosts(@GetUser() user: User) {
    checkIfAdmin(user);
    return this.postService.getMonthlyPosts();
  }

  @Get('/like/:id')
  async getLikesOfPost(@Param() params: MongoId) {
    try {
      return await this.postService.getLikesOfPost(params.id);
    } catch (err) {
      thrower(err);
    }
  }

  @UseGuards(JwtGuard)
  @Post('/like/:id')
  async likePost(@GetUser() user: User, @Param() params: MongoId) {
    return await this.postService.likePost(user, params.id);
  }

  @UseGuards(JwtGuard)
  @Post('/dislike/:id')
  async dislikePost(@Param() params: MongoId) {
    return await this.postService.dislikePost(params.id);
  }

  @UseGuards(JwtGuard)
  @Patch()
  async editPost(@Body() dto: Edit, @GetUser() user: Vendor) {
    try {
      return await this.postService.editPost(dto, user._id);
    } catch (err) {
      thrower(err);
    }
  }

  @UseGuards(JwtGuard)
  @Patch('/report/:id')
  async reportPost(@GetUser() user: User | Vendor, @Param() params: MongoId) {
    return await this.postService.reportPost(params.id, user._id);
  }

  @UseGuards(JwtGuard)
  @Delete('/:id')
  async deletePost(@GetUser() user: User, @Param() params: MongoId) {
    return await this.postService.deletePost(user, params.id);
  }
}
