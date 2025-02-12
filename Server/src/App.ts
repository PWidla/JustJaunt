import express from "express";
import { connectDB } from "./dbCon";
import cors from "cors";
import authRouter from "./routes/auth";
import tripRouter from "./routes/trip";
import attractionRouter from "./routes/attractions";
import foodPlaces from "./routes/foodplaces";
import hotelRouter from "./routes/hotels";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use("/api", authRouter);
app.use("/trip", tripRouter);
app.use("/attractions", attractionRouter);
app.use("/foodplaces", foodPlaces);
app.use("/hotels", hotelRouter);

connectDB()
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB:", error);
  });
