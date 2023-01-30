import * as mongoose from 'mongoose';

export const postSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    mediaType: {
      type: String,
      enum: ['image', 'video', 'none'],
    },
    reports: [mongoose.Schema.Types.ObjectId],
    media: [String],
    caption: String,
    tagged: [mongoose.Schema.Types.ObjectId],
    project: mongoose.Schema.Types.ObjectId,
  },
  {
    timestamps: true,
  },
).index({ owner: 1 });

export interface Post extends Document {
  owner: string;
  mediaType: string;
  media?: string[];
  caption?: string;
  tagged?: string[] | mongoose.Schema.Types.ObjectId[];
  reports?: mongoose.Schema.Types.ObjectId[];
  project?: mongoose.Schema.Types.ObjectId;

  createdAt: Date;
  updatedAt: Date;
  _id: string | mongoose.Schema.Types.ObjectId;
}
