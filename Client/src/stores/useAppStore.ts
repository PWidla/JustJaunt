import { create } from "zustand";
import { createFoodPlacesSlice } from "./foodPlacesStore";
import { createAttractionsSlice } from "./attractionsStore";

export const useAppStore = create((set: any) => ({
  //^to change any
  ...createFoodPlacesSlice(set),
  ...createAttractionsSlice(set),
}));
