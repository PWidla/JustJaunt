import { Model } from "mongoose";
import { Response } from "express";

export const fetchEntitiesByIds = async (
  model: Model<any>,
  ids: string[],
  res: Response
) => {
  try {
    const entities = await model.find({ entityId: { $in: ids } });
    return entities;
  } catch (error) {
    console.error("Error fetching entities:", error);
    res.status(500).json({ message: "Failed to fetch entities" });
  }
};
