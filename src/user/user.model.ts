import * as mongoose from 'mongoose';
import { ObjId } from 'src/utils';
import { Vendor } from 'src/vendor/vendor.model';

export const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      index: true,
      unique: true,
    },
    password: {
      type: String,
    },
    image: String,
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
        default: [0, 0],
      },
    },
    isBanned: {
      type: Boolean,
      default: false,
    },
    savedPosts: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'Post',
    },
    place: String,
    phone: String,
    followers: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'User',
    },
    role: {
      type: String,
      enum: ['user', 'admin', 'vendor', 'super-admin'],
      default: 'user',
      index: true,
      required: true,
    },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vendor',
      index: true,
    },
    authType: {
      type: String,
      enum: ['google', 'facebook', 'email-password'],
      default: 'email-password',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
).index({
  location: '2dsphere',
});

export interface Newbie {
  _id?: string | mongoose.Schema.Types.ObjectId;
  name: string;
  email: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface User {
  name: string;
  email: string;
  password: string;
  role?: 'user' | 'admin' | 'vendor' | 'super-admin';
  image?: string;
  location?: { type: string; coordinates: [number] };
  place: string;
  savedPosts: string[] | ObjId[];
  isBanned: boolean;
  phone?: string;
  followers?: [string | mongoose.Schema.Types.ObjectId | User];
  createdAt?: Date;
  updatedAt?: Date;
  _id?: string | mongoose.Schema.Types.ObjectId;
  // vendor?: string | mongoose.Schema.Types.ObjectId | Vendor;
  vendor?: Vendor;
}
