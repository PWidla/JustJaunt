import mongoose, { Schema, Document } from "mongoose";

interface IAttraction extends Document {
  entityId: string;
  name: string;
  description: string;
  geoCode: { latitude: number; longitude: number };
  pictures: string;
}

const AttractionSchema: Schema = new Schema({
  entityId: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  description: { type: String, required: false },
  geoCode: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  },
  pictures: { type: String, required: false },
});

export const Attraction = mongoose.model<IAttraction>(
  "Attraction",
  AttractionSchema
);
