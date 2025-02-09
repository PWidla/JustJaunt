import mongoose, { Schema, Document } from "mongoose";

interface IHotel extends Document {
  entityId: string;
  name: string;
  geoCode: { latitude: number; longitude: number };
  isChosen: boolean;
}

const HotelSchema: Schema = new Schema(
  {
    entityId: { type: String, unique: true, required: true },
    name: { type: String, required: true },
    geoCode: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
    },
    isChosen: { type: Boolean, default: false },
  },
  { versionKey: false }
);

HotelSchema.pre("save", function (next) {
  if (this.hotelId && !this.entityId) {
    this.entityId = this.hotelId;
  }
  next();
});

export const Hotel = mongoose.model<IHotel>("Hotel", HotelSchema);
