import * as mongoose from 'mongoose';
import { User } from 'src/user/user.model';
import { ObjId } from 'src/utils';

export const commentSchema = new mongoose.Schema(
  {
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    content: {
      type: String,
      required: true,
    },
    likes: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'CommentLike',
    },
  },
  {
    timestamps: true,
  },
);

export interface Comment extends mongoose.Document {
  post: string | ObjId;
  user: User | ObjId | string;
  content: string;
  likes: ObjId[];
}
