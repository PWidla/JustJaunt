import { AmadeusActivity } from "../api/Amadeus";

interface AttractionsSlice {
  selectedAttractions: AmadeusActivity[];
  addAttraction: (attraction: AmadeusActivity) => void;
  removeAttraction: (attractionId: string) => void;
  clearAttractions: () => void;
}

export const createAttractionsSlice = (set: Function): AttractionsSlice => ({
  selectedAttractions: [],

  addAttraction: (attraction) =>
    set((state: AttractionsSlice) => {
      if (state.selectedAttractions.some((a) => a.id === attraction.id)) {
        return state;
      }
      return {
        selectedAttractions: [...state.selectedAttractions, attraction],
      };
    }),

  removeAttraction: (attractionId: string) =>
    set((state: AttractionsSlice) => ({
      selectedAttractions: state.selectedAttractions.filter(
        (attraction) => attraction.id !== attractionId
      ),
    })),

  clearAttractions: () => set({ selectedAttractions: [] }),
});
