import mongoose, { Schema, Document } from "mongoose";

interface IAttraction extends Document {
  entityId: string;
  name: string;
  description: string;
  geoCode: { latitude: number; longitude: number };
  picture: string;
}

const AttractionSchema: Schema = new Schema(
  {
    entityId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String, required: false },
    geoCode: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
    },
    pictures: { type: [String], default: [] },
  },
  { versionKey: false }
);

AttractionSchema.pre("save", function (next) {
  if (this.id && !this.entityId) {
    this.entityId = this.id;
  }
  next();
});

export const Attraction = mongoose.model<IAttraction>(
  "Attraction",
  AttractionSchema
);
