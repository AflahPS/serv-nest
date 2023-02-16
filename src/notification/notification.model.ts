import * as mongoose from 'mongoose';

export const notificationSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    content: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['error', 'warning', 'info', 'success'],
      default: 'warning',
      required: true,
    },
    href: String,
  },
  {
    timestamps: true,
  },
).index({ createdAt: 1 }, { expireAfterSeconds: 3888000 });
// 3888000 seconds = 45 days

export interface Notification {
  _id?: string | mongoose.Schema.Types.ObjectId;
  author: string | mongoose.Schema.Types.ObjectId;
  receiver: string | mongoose.Schema.Types.ObjectId;
  content: string;
  type: 'error' | 'warning' | 'info' | 'success';
}
