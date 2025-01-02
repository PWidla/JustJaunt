import { AuthProvider } from "./context/AuthProvider";
import MainLayout from "./components/Layout/MainLayout/MainLayout";
import { AttractionsProvider } from "./context/AttractionsContext";
import { FoodPlacesProvider } from "./context/FoodPlacesContext";
import { HotelsProvider } from "./context/HotelsContext";

const App = () => {
  return (
    <AuthProvider>
      <HotelsProvider>
        <FoodPlacesProvider>
          <AttractionsProvider>
            <MainLayout />
          </AttractionsProvider>
        </FoodPlacesProvider>
      </HotelsProvider>
    </AuthProvider>
  );
};

export default App;
