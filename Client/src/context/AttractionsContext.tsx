import { createContext, useContext, useState, ReactNode } from "react";
import { AmadeusActivity } from "../api/Amadeus";

interface AttractionsContextType {
  selectedAttractions: AmadeusActivity[];
  addAttraction: (attraction: AmadeusActivity) => void;
  removeAttraction: (attractionId: string) => void;
}

const AttractionsContext = createContext<AttractionsContextType | undefined>(
  undefined
);

export const AttractionsProvider = ({ children }: { children: ReactNode }) => {
  const [selectedAttractions, setSelectedAttractions] = useState<
    AmadeusActivity[]
  >([]);

  const addAttraction = (attraction: AmadeusActivity) => {
    setSelectedAttractions((prev) => {
      if (prev.some((attraction) => attraction.id === attraction.id)) {
        return prev;
      }
      return [...prev, attraction];
    });
  };

  const removeAttraction = (attractionId: string) => {
    setSelectedAttractions((prev) =>
      prev.filter((attraction) => attraction.id !== attractionId)
    );
  };

  return (
    <AttractionsContext.Provider
      value={{ selectedAttractions, addAttraction, removeAttraction }}
    >
      {children}
    </AttractionsContext.Provider>
  );
};

export const useAttractions = () => {
  const context = useContext(AttractionsContext);
  if (!context) {
    throw new Error(
      "useAttractions must be used within an AttractionsProvider"
    );
  }
  return context;
};
