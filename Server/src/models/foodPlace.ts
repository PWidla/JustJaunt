import mongoose, { Schema, Document } from "mongoose";

export interface IFoodPlace extends Document {
  entityId: string;
  name: string;
  geoCode: { latitude: number; longitude: number };
}

const FoodPlaceSchema: Schema = new Schema(
  {
    entityId: { type: String, unique: true, required: true },
    description: { type: String, required: false },
    name: { type: String, required: true },
    geoCode: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
    },
    pictures: { type: [String], default: [] },
  },
  { versionKey: false }
);

FoodPlaceSchema.pre("save", function (next) {
  if (this.id && !this.entityId) {
    this.entityId = this.id;
  }
  next();
});

export const FoodPlace = mongoose.model<IFoodPlace>(
  "FoodPlace",
  FoodPlaceSchema
);
