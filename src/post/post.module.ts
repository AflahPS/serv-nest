import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { MongooseModule } from '@nestjs/mongoose';
import { postSchema } from './post.model';
import { likeSchema } from './like.model';
import { CommentModule } from 'src/comment/comment.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Post', schema: postSchema },
      { name: 'Like', schema: likeSchema },
    ]),
    CommentModule,
  ],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
