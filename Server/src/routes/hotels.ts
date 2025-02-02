import { Router, Request, Response } from "express";
import { fetchEntitiesByIds } from "./helpers/helpers";
import { Hotel } from "../models/hotel";

const router = Router();

router.get("/", async (req: Request, res: Response): Promise<any> => {
  const { ids } = req.query;
  if (!ids) {
    return res.status(400).json({ message: "Missing 'ids' query parameter" });
  }

  const idArray = (ids as string).split(",");

  const hotels = await fetchEntitiesByIds(Hotel, idArray, res);
  res.status(200).json(hotels);
});

export default router;
