import * as mongoose from 'mongoose';
import { Project } from 'src/project/project.model';
import { Service } from 'src/service/service.model';
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
    employees: {
      type: [
        {
          emp: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
          },
          joined: {
            type: Date,
            default: new Date(Date.now()),
          },
          projects: { type: [mongoose.Schema.Types.ObjectId], ref: 'Project' },
        },
      ],
    },
    jobs: [mongoose.Schema.Types.ObjectId],
    projects: { type: [mongoose.Schema.Types.ObjectId], ref: 'Project' },
  },
  {
    timestamps: true,
  },
);

export interface Vendor extends User {
  user?: User | string;
  service: Service;
  about: string;
  workingDays?: string;
  workRadius?: string;
  experience?: number;
  employees?: [
    {
      emp: User;
      joined: Date;
      projects: Project[];
    },
  ];
  jobs?: [string | mongoose.Schema.Types.ObjectId];
  projects?: [string | mongoose.Schema.Types.ObjectId];
}
