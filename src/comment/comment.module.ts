import { Module } from '@nestjs/common';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { MongooseModule } from '@nestjs/mongoose';
import { commentSchema } from './comment.model';
import { commentLikeSchema } from './commentLike.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Comment', schema: commentSchema },
      { name: 'CommentLike', schema: commentLikeSchema },
    ]),
  ],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
