import mongoose, { Schema, Document } from "mongoose";

interface IHotel extends Document {
  entityId: string;
  name: string;
  geoCode: { latitude: number; longitude: number };
}

const HotelSchema: Schema = new Schema(
  {
    entityId: { type: String, unique: true, required: true },
    name: { type: String, required: true },
    geoCode: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
    },
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
