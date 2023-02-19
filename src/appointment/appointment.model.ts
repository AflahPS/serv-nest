import * as mongoose from 'mongoose';

export const appointmentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
      index: true,
    },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
      index: true,
    },
    description: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      default: 'requested',
      enum: [
        'requested',
        'approved',
        'denied',
        'finished',
        'failed',
        'postponed',
      ],
    },
  },
  {
    timestamps: true,
  },
);

export interface Appointment {
  _id?: string | mongoose.Schema.Types.ObjectId;
  user: string | mongoose.Schema.Types.ObjectId;
  vendor: string | mongoose.Schema.Types.ObjectId;
  date: Date;
  status: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}
