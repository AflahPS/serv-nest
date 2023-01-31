import * as mongoose from 'mongoose';
import { User } from 'src/user/user.model';
import { ObjId } from 'src/utils';

export const commentLikeSchema = new mongoose.Schema(
  {
    comment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
      required: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  },
).index({ comment: 1, user: 1 }, { unique: true });

export interface CommentLike extends mongoose.Document {
  comment: string | ObjId;
  user: User | ObjId | string;
}
