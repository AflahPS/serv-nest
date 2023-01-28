import * as mongoose from 'mongoose';
import { User } from 'src/user/user.model';
import { ObjId } from 'src/utils';

export const likeSchema = new mongoose.Schema(
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
  },
  {
    timestamps: true,
  },
).index({ post: 1, user: 1 }, { unique: true });

export interface Like {
  post: string | ObjId;
  user: User | ObjId | string;
}
