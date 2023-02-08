import * as mongoose from 'mongoose';
import { User } from 'src/user/user.model';

export const vendorSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      index: true,
    },
    about: {
      type: String,
      required: true,
    },
    workingDays: String,
    workRadius: String,
    experience: Number,
    employees: { type: [mongoose.Schema.Types.ObjectId], ref: 'Employee' },
    jobs: [mongoose.Schema.Types.ObjectId],
    projects: { type: [mongoose.Schema.Types.ObjectId], ref: 'Project' },
  },
  {
    timestamps: true,
  },
);

export interface Vendor extends User {
  user?: string | mongoose.Schema.Types.ObjectId;
  service: string | mongoose.Schema.Types.ObjectId;
  about: string;
  workingDays?: string;
  workRadius?: string;
  experience?: number;
  employees?: [string | mongoose.Schema.Types.ObjectId];
  jobs?: [string | mongoose.Schema.Types.ObjectId];
  projects?: [string | mongoose.Schema.Types.ObjectId];
}
