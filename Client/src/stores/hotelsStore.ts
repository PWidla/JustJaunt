import { AmadeusHotel } from "../api/Amadeus";

interface HotelsSlice {
  selectedHotels: AmadeusHotel[];
  addHotel: (hotel: AmadeusHotel) => void;
  removeHotel: (hotelDupeId: number) => void;
}

export const createHotelsSlice = (set: Function): HotelsSlice => ({
  selectedHotels: [],

  addHotel: (hotel) =>
    set((state: HotelsSlice) => {
      if (state.selectedHotels.some((a) => a.dupeId === hotel.dupeId)) {
        return state;
      }
      return {
        selectedHotels: [...state.selectedHotels, hotel],
      };
    }),

  removeHotel: (hotelDupeId: number) =>
    set((state: HotelsSlice) => ({
      selectedHotels: state.selectedHotels.filter(
        (hotel) => hotel.dupeId !== hotelDupeId
      ),
    })),
});
