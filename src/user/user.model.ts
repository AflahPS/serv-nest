import * as mongoose from 'mongoose';

export const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    image: String,
    location: { lat: String, lon: String },
    phone: String,
    followers: [mongoose.Schema.Types.ObjectId],
    requests: [mongoose.Schema.Types.ObjectId],
  },
  {
    timestamps: true,
  },
);

export interface Newbie {
  _id?: string | mongoose.Schema.Types.ObjectId;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  name: string;
  email: string;
  password: string;
  image?: string;
  location?: { lat: string; lon: string };
  phone?: string;
  followers?: [string | mongoose.Schema.Types.ObjectId];
  requests?: [string | mongoose.Schema.Types.ObjectId];
  createdAt: Date;
  updatedAt: Date;
  _id: string | mongoose.Schema.Types.ObjectId;
}
