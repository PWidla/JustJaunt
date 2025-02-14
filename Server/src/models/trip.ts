import mongoose, { Schema, Document } from "mongoose";

interface TripActivity {
  entityId: string;
  day: number | null;
}

interface TripHotel {
  entityId: string;
  isChosen: boolean;
}

interface PackingItem {
  name: string;
  isChecked: boolean;
}

interface ITrip extends Document {
  userId: string;
  isShared: boolean;
  selectedAttractions: TripActivity[];
  selectedFoodPlaces: TripActivity[];
  selectedHotels: TripHotel[];
  packingList: PackingItem[];
  days: Number;
}

const TripSchema: Schema = new Schema(
  {
    userId: { type: String, required: true },
    isShared: { type: Boolean, required: true, default: false },
    selectedAttractions: [
      {
        entityId: { type: String, required: true },
        day: { type: Number, required: false, default: null },
      },
    ],
    selectedHotels: [
      {
        entityId: { type: String, required: true },
        isChosen: { type: Boolean, required: true, default: false },
      },
    ],
    selectedFoodPlaces: [
      {
        entityId: { type: String, required: true },
        day: { type: Number, required: false, default: null },
      },
    ],
    packingList: [
      {
        name: { type: String, required: true },
        isChecked: { type: Boolean, default: false },
      },
    ],
    days: { type: Number, required: true },
  },
  { versionKey: false }
);

export const Trip = mongoose.model<ITrip>("Trip", TripSchema);
