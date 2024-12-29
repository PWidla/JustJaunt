import { createContext, useContext, useState, ReactNode } from "react";
import { AmadeusActivity } from "../api/Amadeus";

interface FoodPlacesContextType {
  selectedFoodPlaces: AmadeusActivity[];
  addFoodPlace: (foodPlace: AmadeusActivity) => void;
  removeFoodPlace: (foodPlaceId: string) => void;
}

const FoodPlacesContext = createContext<FoodPlacesContextType | undefined>(
  undefined
);

export const FoodPlacesProvider = ({ children }: { children: ReactNode }) => {
  const [selectedFoodPlaces, setSelectedFoodPlaces] = useState<
    AmadeusActivity[]
  >([]);

  const addFoodPlace = (foodPlace: AmadeusActivity) => {
    setSelectedFoodPlaces((prev) => {
      if (prev.some((a) => a.id === foodPlace.id)) {
        return prev;
      }
      return [...prev, foodPlace];
    });
  };

  const removeFoodPlace = (foodPlaceId: string) => {
    setSelectedFoodPlaces((prev) =>
      prev.filter((place) => place.id !== foodPlaceId)
    );
  };

  return (
    <FoodPlacesContext.Provider
      value={{ selectedFoodPlaces, addFoodPlace, removeFoodPlace }}
    >
      {children}
    </FoodPlacesContext.Provider>
  );
};

export const useFoodPlaces = () => {
  const context = useContext(FoodPlacesContext);
  if (!context) {
    throw new Error("useFoodPlaces must be used within an FoodPlacesProvider");
  }
  return context;
};
