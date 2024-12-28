import { AuthProvider } from "./context/AuthProvider";
import MainLayout from "./components/Layout/MainLayout/MainLayout";
import { AttractionsProvider } from "./context/AttractionsContext";
import { FoodPlacesProvider } from "./context/FoodPlacesContext";

const App = () => {
  return (
    <AuthProvider>
      <FoodPlacesProvider>
        <AttractionsProvider>
          <MainLayout />
        </AttractionsProvider>
      </FoodPlacesProvider>
    </AuthProvider>
  );
};

export default App;
