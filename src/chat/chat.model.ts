import * as mongoose from 'mongoose';
import { User } from 'src/user/user.model';
import { ObjId } from 'src/utils';

export const chatSchema = new mongoose.Schema(
  {
    user1: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    user2: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    lastSession: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    timestamps: true,
  },
).index({ user1: 1, user2: 1 }, { unique: true });

export interface Chat extends mongoose.Document {
  user1: User | ObjId | string;
  user2: User | ObjId | string;
  lastSession?: Date;
}
