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
import { CommentService } from './comment.service';
import { JwtGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator';
import { User } from 'src/user/user.model';
import { Create } from './dto';
import { MongoId } from 'src/utils';

@Controller('api/v1/comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @UseGuards(JwtGuard)
  @Post()
  async addComment(@Body() dto: Create, @GetUser() user: User) {
    return this.commentService.createComment(dto, user._id);
  }

  @Get('/post/:id')
  async getCommentsOfPost(@Param() params: MongoId) {
    return this.commentService.getCommentsOfPost(params.id);
  }

  @Get('/like/:id')
  async getCommentLikes(@Param() params: MongoId) {
    return this.commentService.getCommentLikes(params.id);
  }

  @UseGuards(JwtGuard)
  @Patch('/like/:id')
  async likeComment(@Param() params: MongoId, @GetUser() user: User) {
    return this.commentService.likeComment(params.id, user._id);
  }

  @UseGuards(JwtGuard)
  @Patch('/dislike/:id')
  async dislikeComment(@Param() params: MongoId, @GetUser() user: User) {
    return this.commentService.dislikeComment(params.id, user._id);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  async deleteCommentById(@Param() params: MongoId, @GetUser() user: User) {
    return this.commentService.deleteCommentById(params.id, user._id);
  }
}
