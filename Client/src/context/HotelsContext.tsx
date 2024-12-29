import { createContext, useContext, useState, ReactNode } from "react";
import { AmadeusHotel } from "../api/Amadeus";

interface HotelsContextType {
  selectedHotels: AmadeusHotel[];
  addHotel: (hotel: AmadeusHotel) => void;
  removeHotel: (hotelId: number) => void;
}

const HotelsContext = createContext<HotelsContextType | undefined>(undefined);

export const HotelsProvider = ({ children }: { children: ReactNode }) => {
  const [selectedHotels, setSelectedHotels] = useState<AmadeusHotel[]>([]);

  const addHotel = (hotel: AmadeusHotel) => {
    setSelectedHotels((prev) => {
      if (prev.some((a) => a.dupeId === hotel.dupeId)) {
        return prev;
      }
      return [...prev, hotel];
    });
  };

  const removeHotel = (hotelDupeId: number) => {
    setSelectedHotels((prev) =>
      prev.filter((hotel) => hotel.dupeId !== hotelDupeId)
    );
  };

  return (
    <HotelsContext.Provider value={{ selectedHotels, addHotel, removeHotel }}>
      {children}
    </HotelsContext.Provider>
  );
};

export const useHotels = () => {
  const context = useContext(HotelsContext);
  if (!context) {
    throw new Error("useHotels must be used within an HotelsProvider");
  }
  return context;
};
