import express, { Request, Response } from "express";
import { Trip } from "../models/trip";
import { Attraction } from "../models/attraction";
import { Hotel } from "../models/hotel";
import { FoodPlace } from "../models/foodPlace";

const router = express.Router();

router.get("/:tripId", async (req: Request, res: Response): Promise<any> => {
  const { tripId } = req.params;

  try {
    const trip = await Trip.findById(tripId);

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    res.status(200).json({ trip });
  } catch (error) {
    console.error("Error fetching trip:", error);
    res.status(500).json({ message: "Failed to fetch trip data" });
  }
});

router.get(
  "/user/:userId",
  async (req: Request, res: Response): Promise<any> => {
    const { userId } = req.params;
    console.log("userId", userId);
    try {
      const trips = await Trip.find({ userId });
      console.log("trips", trips);
      if (!trips || trips.length === 0) {
        return res
          .status(404)
          .json({ message: "No trips found for this user." });
      }

      res.status(200).json({ trips });
    } catch (error) {
      console.error("Error fetching trips:", error);
      res.status(500).json({ message: "Failed to fetch trips data" });
    }
  }
);

router.post(
  "/save-with-days",
  async (req: Request, res: Response): Promise<any> => {
    console.log("Received body:", req.body);

    const {
      tripId,
      userId,
      selectedAttractions,
      selectedHotels,
      selectedFoodPlaces,
      days,
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
          days: days || 1,
        });
      }

      console.log("Trip found/created:", trip);

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
          if ((entity.id || entity.hotelId) && !entity.entityId) {
            entity.entityId = entity.id || entity.hotelId;
          }

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
      trip.days = days;

      await trip.save();

      console.log("Final saved trip:", trip);

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
