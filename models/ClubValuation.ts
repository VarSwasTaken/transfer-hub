import mongoose, { Schema, model, models, Document } from 'mongoose';

export interface IClubValuation extends Document {
  clubId: number;
  year: number;
  value: number; // suma wartości zawodników w danym roku
  currency: string;
  createdAt: Date;
  updatedAt: Date;
}

const ClubValuationSchema = new Schema(
  {
    clubId: { type: Number, required: true },
    year: { type: Number, required: true, min: 1900 },
    value: { type: Number, required: true, min: 0 },
    currency: { type: String, default: 'EUR', trim: true, uppercase: true },
  },
  { timestamps: true },
);

// Unikalny wpis na (clubId, year)
ClubValuationSchema.index({ clubId: 1, year: 1 }, { unique: true });
ClubValuationSchema.index({ clubId: 1, year: -1 });

const ClubValuation = models.ClubValuation || model<IClubValuation>('ClubValuation', ClubValuationSchema);

export default ClubValuation;
