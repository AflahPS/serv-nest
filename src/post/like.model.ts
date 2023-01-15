import * as mongoose from 'mongoose';
import { ObjId } from 'src/utils';

export const likeSchema = new mongoose.Schema(
  {
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
      index: true,
    },
    owner: {
      type: {
        name: String,
        image: String,
        isUser: Boolean,
      },
      required: true,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
    },
  },
  {
    timestamps: true,
  },
).index({ post: 1, ownerId: 1 }, { unique: true });

export interface Like {
  post: string | ObjId;
  owner: {
    name: string;
    image: string;
    isUser: boolean;
    uid: string | ObjId;
  };
}
