import * as mongoose from 'mongoose';

export const serviceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    image: {
      type: String,
      required: true,
    },
    caption: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

export interface Service {
  _id?: string | mongoose.Schema.Types.ObjectId;
  title: string;
  image: string;
  caption: string;
}
