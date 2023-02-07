import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment } from './comment.model';
import { CommentLike } from './commentLike.model';
import { ObjId, thrower } from 'src/utils';
import { Create } from './dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel('Comment') private readonly commentModel: Model<Comment>,
    @InjectModel('CommentLike')
    private readonly commentLikeModel: Model<CommentLike>,
  ) {}

  async createComment(dto: Create, userId: ObjId | string) {
    try {
      dto.user = userId;
      const prepComment = new this.commentModel(dto);
      const newComment = await prepComment.save();
      const comment = await newComment.populate({
        path: 'user',
        select: 'name image',
      });
      return { status: 'success', comment };
    } catch (err) {
      thrower(err);
    }
  }

  async getCommentsOfPost(postId: ObjId | string) {
    try {
      const comments = await this.commentModel
        .find({ post: postId })
        .populate({ path: 'user', select: 'name image' })
        .sort('-createdAt');
      return { status: 'success', results: comments.length, comments };
    } catch (err) {
      thrower(err);
    }
  }

  async likeComment(commentId: ObjId | string, userId: ObjId | string) {
    try {
      const dto = {
        comment: commentId,
        user: userId,
      };
      const prepCommentLike = new this.commentLikeModel(dto);
      const newCommentLike = await prepCommentLike.save();
      return { status: 'success', like: newCommentLike };
    } catch (err) {
      thrower(err);
    }
  }

  async dislikeComment(commentId: ObjId | string, userId: ObjId | string) {
    try {
      const res = await this.commentLikeModel.findOneAndDelete({
        user: userId,
        comment: commentId,
      });
      console.log(res);
      if (res) return { status: 'success' };
    } catch (err) {
      thrower(err);
    }
  }

  async getCommentLikes(id: string) {
    try {
      const commentLikes = await this.commentLikeModel.find({ comment: id });
      return {
        status: 'success',
        results: commentLikes.length,
        likes: commentLikes,
      };
    } catch (err) {
      thrower(err);
    }
  }

  async deleteCommentById(id: string, userId: string | ObjId) {
    try {
      const comment = await this.commentModel.findById(id);
      if (!comment) {
        throw new NotFoundException('Comment not found !');
      }
      if (comment.user.toString() !== userId.toString()) {
        throw new ForbiddenException('User not authorized for this acion !');
      }
      await comment.remove();
      return { status: 'success' };
    } catch (err) {
      thrower(err);
    }
  }
}
