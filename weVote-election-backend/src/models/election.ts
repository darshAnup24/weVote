import mongoose, { Document, Schema } from 'mongoose';

export interface Election extends Document {
    title: string;
    date: Date;
    candidates: string[];
}

const electionSchema: Schema = new Schema({
    title: { type: String, required: true },
    date: { type: Date, required: true },
    candidates: { type: [String], required: true }
});

export const ElectionModel = mongoose.model<Election>('Election', electionSchema);