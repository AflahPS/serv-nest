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
      unique: true,
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
    image: String,
    experience: Number,
    requests: [mongoose.Schema.Types.ObjectId],
    followes: [mongoose.Schema.Types.ObjectId],
    employees: [mongoose.Schema.Types.ObjectId],
    jobs: [mongoose.Schema.Types.ObjectId],
    projects: [mongoose.Schema.Types.ObjectId],
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
  image?: string;
  experience?: number;
  followers?: [string | mongoose.Schema.Types.ObjectId];
  requests?: [string | mongoose.Schema.Types.ObjectId];
  employees?: [string | mongoose.Schema.Types.ObjectId];
  jobs?: [string | mongoose.Schema.Types.ObjectId];
  projects?: [string | mongoose.Schema.Types.ObjectId];
  createdAt?: Date;
  updatedAt?: Date;
}
