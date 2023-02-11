import * as mongoose from 'mongoose';
import { User } from 'src/user/user.model';
import { ObjId } from 'src/utils';

export const chatMessageSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    text: {
      type: String,
      required: true,
    },
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chat',
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

export interface ChatMessage extends mongoose.Document {
  author: User | ObjId | string;
  chat: User | ObjId | string;
  text: string;
}
