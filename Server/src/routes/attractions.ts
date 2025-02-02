import { Router, Request, Response } from "express";
import { fetchEntitiesByIds } from "./helpers/helpers";
import { Attraction } from "../models/attraction";
const router = Router();

router.get("/", async (req: Request, res: Response): Promise<any> => {
  const { ids } = req.query;
  if (!ids) {
    return res.status(400).json({ message: "Missing 'ids' query parameter" });
  }

  const idArray = (ids as string).split(",");

  const attractions = await fetchEntitiesByIds(Attraction, idArray, res);
  res.status(200).json(attractions);
});

export default router;
