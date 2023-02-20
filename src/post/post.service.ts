import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Create, Edit } from './dto';
import { Post } from './post.model';
import mongoose, { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ObjId, lastWeekMade, monthlyMade, returner, thrower } from 'src/utils';
import { Like } from './like.model';
import { User } from 'src/user/user.model';
import { Vendor } from 'src/vendor/vendor.model';
import { CommentService } from 'src/comment/comment.service';
import { checkIfAdmin } from 'src/utils/util.functions';

@Injectable()
export class PostService {
  constructor(
    @InjectModel('Post') private readonly postModel: Model<Post>,
    @InjectModel('Like') private readonly likeModel: Model<Like>,
    private readonly commentService: CommentService,
  ) {}

  async createPost(dto: Create) {
    try {
      const prepPost = new this.postModel(dto);
      const newPost = await prepPost.save();
      return { status: 'success', post: newPost };
    } catch (err) {
      thrower(err);
    }
  }

  async getPostById(id: string | ObjId) {
    try {
      const post = await this.postModel.findById(id).exec();
      if (!post) throw new NotFoundException('Post not found !!');
      return post;
    } catch (err) {
      thrower(err);
    }
  }

  async getPostByUserId(id: string | ObjId) {
    try {
      const posts = await this.postModel
        .find({ owner: id })
        .sort('-createdAt')
        .limit(10)
        .populate({ path: 'owner', select: 'name image createdAt updatedAt' })
        .exec();
      if (!posts.length) throw new NotFoundException('Post not found !!');
      return { posts };
    } catch (err) {
      thrower(err);
    }
  }

  // Need something EO-Alg here
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getPostForUser(id: string | ObjId) {
    try {
      const posts = await this.postModel
        .find()
        .sort('-createdAt')
        .limit(10)
        .populate({ path: 'owner', select: 'name image createdAt updatedAt' })
        .exec();
      if (!posts.length) throw new NotFoundException('Post not found !!');
      return { posts };
    } catch (err) {
      thrower(err);
    }
  }

  async getPostForGuest() {
    try {
      const posts = await this.postModel
        .find()
        .sort('-createdAt')
        .limit(10)
        .populate({ path: 'owner', select: 'name image createdAt updatedAt' })
        .exec();
      if (!posts.length) throw new NotFoundException('Post not found !!');
      return { posts };
    } catch (err) {
      thrower(err);
    }
  }

  async getAllPosts() {
    try {
      const posts = await this.postModel
        .find()
        .sort('-createdAt')
        .populate({
          path: 'owner',
          select: 'name image createdAt updatedAt role',
        })
        .exec();
      if (!posts.length) throw new NotFoundException('Post not found !!');
      const newPosts = [];
      for (let i = 0; i < posts.length; i++) {
        const likes = await this.getLikeCountOfPost(posts[i]._id.toString());
        const comments = await this.commentService.getCommentCountOfPost(
          posts[i]._id.toString(),
        );
        const clonedPost = posts[i].toObject({
          getters: false,
          virtuals: false,
        });
        newPosts.push(Object.assign({}, clonedPost, { likes, comments }));
      }
      return returner({ results: posts.length, posts: newPosts });
    } catch (err) {
      thrower(err);
    }
  }

  async getLikeCountOfPost(postId: string) {
    try {
      const likesCount = await this.likeModel.aggregate([
        {
          $match: {
            post: new mongoose.Types.ObjectId(postId),
          },
        },
        {
          $count: 'likeCount',
        },
      ]);
      if (!likesCount.length) return 0;
      return likesCount[0]?.likeCount;
    } catch (err) {
      thrower(err);
    }
  }

  async likePost(user: User | Vendor, postId: string | ObjId) {
    try {
      const prepLike = new this.likeModel({
        post: postId,
        user: user._id,
      });
      const newLike = await prepLike.save();
      if (newLike) return { status: 'success' };
      return { status: 'Something went wrong !!' };
    } catch (err) {
      thrower(err);
    }
  }

  async dislikePost(postId: string | ObjId) {
    try {
      const res = await this.likeModel
        .findOneAndDelete({ post: postId })
        .exec();

      if (res) return { status: 'success' };
      throw new NotFoundException('Could not find the post');
    } catch (err) {
      thrower(err);
    }
  }

  async getLikesOfPost(postId: string | ObjId) {
    try {
      const likes = await this.likeModel
        .find({ post: postId })
        .populate({ path: 'user', select: 'name image' });
      return { results: likes.length, likes: likes };
    } catch (err) {
      thrower(err);
    }
  }

  async editPost(dto: Edit, uid: ObjId | string) {
    try {
      const post = await this.postModel.findById(dto._id);

      // Check if the req comes from owner of the post
      if (post.owner.toString() !== uid.toString())
        throw new ForbiddenException('You are not allowed to edit this post');

      // Combine new+old data and save
      Object.assign(post, dto);
      const newPost = await post.save();
      return { status: 'success', post: newPost };
    } catch (err) {
      thrower(err);
    }
  }

  async reportPost(postId: ObjId | string, userId: ObjId | string) {
    try {
      const post: Post = await this.postModel
        .findByIdAndUpdate(
          postId,
          { $addToSet: { reports: userId } },
          { new: true },
        )
        .exec();

      return { status: 'success', post };
    } catch (err) {
      thrower(err);
    }
  }

  async deletePost(user: User, pid: ObjId | string) {
    try {
      const post = await this.postModel.findById(pid);
      if (post.owner.toString() !== user._id.toString() && !checkIfAdmin(user))
        throw new ForbiddenException(
          'You are not allowed to perform this operation !',
        );
      await post.remove();
      await this.likeModel.deleteMany({ post: post._id });
      await this.commentService.deleteCommentsOfPost(post._id as ObjId);
      return { status: 'success' };
    } catch (err) {
      thrower(err);
    }
  }

  async getLastWeekPosts() {
    try {
      return await lastWeekMade(this.postModel);
    } catch (err) {
      thrower(err);
    }
  }

  async getMonthlyPosts() {
    try {
      return await monthlyMade(this.postModel);
    } catch (err) {
      thrower(err);
    }
  }

  // async sharePost(dto) {
  //   return dto;
  // }
}
