import * as mongoose from 'mongoose';

export const vendorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    service: {
      type: String,
      required: true,
    },
    location: {
      type: { lat: String, lon: String },
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    about: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export interface Vendor {
  _id?: string | mongoose.Schema.Types.ObjectId;
  name: string;
  email: string;
  password: string;
  service: string | mongoose.Schema.Types.ObjectId;
  location: { lat: string; lon: string };
  phone: string;
  about: string;
  createdAt?: Date;
  updatedAt?: Date;
}
