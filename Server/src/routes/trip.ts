import express, { Request, Response } from "express";
import { Trip } from "../models/trip";
import { Attraction } from "../models/attraction";
import { Hotel } from "../models/hotel";
import { FoodPlace } from "../models/foodPlace";

const router = express.Router();

router.post(
  "/save-with-days",
  async (req: Request, res: Response): Promise<any> => {
    const {
      tripId,
      userId,
      selectedAttractions,
      selectedHotels,
      selectedFoodPlaces,
    } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "UserId is required." });
    }

    try {
      let trip = await Trip.findOne({ _id: tripId });

      if (!trip) {
        if (!selectedAttractions || !selectedHotels || !selectedFoodPlaces) {
          return res.status(400).json({
            message:
              "You must provide at least some selected objects when creating a trip.",
          });
        }
        trip = new Trip({
          userId,
          selectedAttractions: [],
          selectedHotels: [],
          selectedFoodPlaces: [],
        });
      }
      console.log("trip");
      console.log(trip);

      if (trip.userId.toString() !== userId) {
        return res
          .status(403)
          .json({ message: "You are not authorized to update this trip." });
      }

      const saveEntities = async (
        model: any,
        entities: { entityId: string; [key: string]: any }[]
      ) => {
        const operations = entities.map(async (entity) => {
          await model.updateOne(
            { entityId: entity.entityId },
            { $setOnInsert: entity },
            { upsert: true }
          );
        });
        await Promise.all(operations);
      };

      await saveEntities(Attraction, selectedAttractions);
      await saveEntities(Hotel, selectedHotels);
      await saveEntities(FoodPlace, selectedFoodPlaces);

      trip.selectedAttractions = selectedAttractions;
      trip.selectedHotels = selectedHotels;
      trip.selectedFoodPlaces = selectedFoodPlaces;

      await trip.save();

      res.status(201).json({
        message: "Trip saved or updated successfully.",
        trip,
      });
    } catch (error) {
      console.error("Error saving/updating trip:", error);
      res.status(500).json({ message: "Failed to save or update the trip." });
    }
  }
);

export default router;
