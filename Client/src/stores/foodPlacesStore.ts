import { AmadeusActivity } from "../api/Amadeus";

interface FoodPlacesSlice {
  selectedFoodPlaces: AmadeusActivity[];
  addFoodPlace: (foodPlace: AmadeusActivity) => void;
  removeFoodPlace: (foodPlaceId: string) => void;
}

export const createFoodPlacesSlice = (set: Function): FoodPlacesSlice => ({
  selectedFoodPlaces: [],

  addFoodPlace: (foodPlace) =>
    set((state: FoodPlacesSlice) => {
      if (state.selectedFoodPlaces.some((a) => a.id === foodPlace.id)) {
        return state;
      }
      return {
        selectedFoodPlaces: [...state.selectedFoodPlaces, foodPlace],
      };
    }),

  removeFoodPlace: (foodPlaceId: string) =>
    set((state: FoodPlacesSlice) => ({
      selectedFoodPlaces: state.selectedFoodPlaces.filter(
        (place) => place.id !== foodPlaceId
      ),
    })),
});
