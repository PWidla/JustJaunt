import mongoose, { Schema, Document } from "mongoose";

interface TripEntity {
  entityId: string;
  day?: number | null;
}

interface ITrip extends Document {
  userId: string;
  selectedAttractions: TripEntity[];
  selectedHotels: TripEntity[];
  selectedFoodPlaces: TripEntity[];
}

const TripSchema: Schema = new Schema({
  userId: { type: String, required: true },
  selectedAttractions: [
    {
      entityId: { type: String, required: true },
      day: { type: Number, required: false, default: null },
    },
  ],
  selectedHotels: [
    {
      entityId: { type: String, required: true },
      day: { type: Number, required: false, default: null },
    },
  ],
  selectedFoodPlaces: [
    {
      entityId: { type: String, required: true },
      day: { type: Number, required: false, default: null },
    },
  ],
});

export const Trip = mongoose.model<ITrip>("Trip", TripSchema);
