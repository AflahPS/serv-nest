import * as mongoose from 'mongoose';

export const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vendor',
      required: true,
      index: true,
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['pending', 'running', 'completed', 'cancelled', 'failed'],
      default: 'pending',
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
    employees: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'User',
    },

    place: {
      type: String,
      required: true,
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    caption: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
).index({ title: 1, vendor: 1 }, { unique: true });

export interface Project {
  _id?: string | mongoose.Schema.Types.ObjectId;
  title: string;
  vendor: string | mongoose.Schema.Types.ObjectId;
  service: string | mongoose.Schema.Types.ObjectId;
  status: 'pending' | 'running' | 'completed' | 'cancelled' | 'failed';
  location?: { type: string; coordinates: [number] };
  place: string;
  client: string | mongoose.Schema.Types.ObjectId;
  startDate: Date | string;
  endDate: Date | string;
  caption?: string;
  employees?: string[];
}
