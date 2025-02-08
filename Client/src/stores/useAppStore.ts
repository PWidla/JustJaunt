import { create } from "zustand";
import { createFoodPlacesSlice } from "./foodPlacesStore";
import { createAttractionsSlice } from "./attractionsStore";
import { createHotelsSlice } from "./hotelsStore";

export const useAppStore = create((set: any, get: any) => ({
  //^to change any
  ...createFoodPlacesSlice(set),
  ...createAttractionsSlice(set),
  ...createHotelsSlice(set),

  clearAllSelections: () => {
    get().clearAttractions();
    get().clearHotels();
    get().clearFoodPlaces();
  },
}));
