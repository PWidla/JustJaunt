import { create } from "zustand";
import { createFoodPlacesSlice } from "./foodPlacesStore";
import { createAttractionsSlice } from "./attractionsStore";
import { createHotelsSlice } from "./hotelsStore";

export const useAppStore = create((set: any) => ({
  //^to change any
  ...createFoodPlacesSlice(set),
  ...createAttractionsSlice(set),
  ...createHotelsSlice(set),
}));
