import { Schema, model, Types } from 'mongoose';

export const ShirtSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'] as const;

export type Registration = {
    userId: Types.ObjectId;
    eventId: Types.ObjectId;
    raceCategoryId: Types.ObjectId;
    bibNumber?: string;
    shirtSize: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';
    emergencyContact: {
        name: string;
        phone: string;
        relationship: string;
    };
    medicalInfo: {
        conditions?: string;
        allergies?: string;
        medications?: string;
    };
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
    deviceId?: Types.ObjectId;
    paymentId?: Types.ObjectId;
    registeredAt: Date;
    createdAt: Date;
    updatedAt: Date;
};

const RegistrationSchema = new Schema<Registration>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    eventId: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
      index: true,
    },

    raceCategoryId: {
      type: Schema.Types.ObjectId,
      required: true,
    },

    bibNumber: {
      type: String,
      unique: true,
      sparse: true,
    },

    shirtSize: {
      type: String,
      enum: ShirtSizes,
      required: true,
    },

    emergencyContact: {
      name: String,
      phone: String,
      relationship: String,
    },

    medicalInfo: {
      conditions: String,
      allergies: String,
      medications: String,
    },

    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed'],
      default: 'pending',
      index: true,
    },

    deviceId: {
      type: Schema.Types.ObjectId,
      ref: 'Device',
    },

    paymentId: {
      type: Schema.Types.ObjectId,
      ref: 'Payment',
    },

    registeredAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const RegistrationModel = model<Registration>('Registration', RegistrationSchema);
export default RegistrationModel;
