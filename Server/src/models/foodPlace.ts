import mongoose, { Schema, Document } from "mongoose";

interface IFoodPlace extends Document {
  entityId: string;
  name: string;
  geoCode: { latitude: number; longitude: number };
}

const FoodPlaceSchema: Schema = new Schema({
  entityId: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  geoCode: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  },
});

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
