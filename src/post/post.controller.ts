import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { PostService } from './post.service';
import { Create, Edit } from './dto';
import { JwtGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator';
import { MongoId, ObjId, thrower } from 'src/utils';
import { Vendor } from 'src/vendor/vendor.model';
import { User } from 'src/user/user.model';

@Controller('post')
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

  @UseGuards(JwtGuard)
  @Get()
  async getPostForUser(@GetUser() user: User | Vendor) {
    try {
      return await this.postService.getPostForUser(user._id);
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

  @Get('/owner/:id')
  async getPostByUser(@Param() params: MongoId) {
    try {
      return await this.postService.getPostByUserId(params.id);
    } catch (err) {
      thrower(err);
    }
  }

  @UseGuards(JwtGuard)
  @Post('/like/:id')
  async likePost(@GetUser() user: User | Vendor, @Param() params: MongoId) {
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
  async deletePost(@GetUser() user: Vendor, @Param() params: MongoId) {
    return await this.postService.deletePost(user._id, params.id);
  }
}