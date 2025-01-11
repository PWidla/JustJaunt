import { AuthProvider } from "./context/AuthProvider";
import MainLayout from "./components/Layout/MainLayout/MainLayout";
import { AttractionsProvider } from "./context/AttractionsContext";
import { HotelsProvider } from "./context/HotelsContext";

const App = () => {
  return (
    <AuthProvider>
      <HotelsProvider>
        <AttractionsProvider>
          <MainLayout />
        </AttractionsProvider>
      </HotelsProvider>
    </AuthProvider>
  );
};

export default App;
