import { create } from "zustand";
import { createFoodPlacesSlice } from "./foodPlacesStore";

export const useAppStore = create((set: any) => ({
  //^to change any
  ...createFoodPlacesSlice(set),
}));
