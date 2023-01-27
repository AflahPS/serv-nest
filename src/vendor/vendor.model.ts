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
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    place: String,
    phone: {
      type: String,
      required: true,
    },
    about: {
      type: String,
      required: true,
    },
    workingDays: String,
    workRadius: String,
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
  location?: { type: string; coordinates: [number] };
  place?: string;
  phone: string;
  about: string;
  image?: string;
  workingDays?: string;
  workRadius?: string;
  experience?: number;
  followers?: [string | mongoose.Schema.Types.ObjectId];
  requests?: [string | mongoose.Schema.Types.ObjectId];
  employees?: [string | mongoose.Schema.Types.ObjectId];
  jobs?: [string | mongoose.Schema.Types.ObjectId];
  projects?: [string | mongoose.Schema.Types.ObjectId];
  createdAt?: Date;
  updatedAt?: Date;
}
