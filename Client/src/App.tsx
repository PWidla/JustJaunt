import { AuthProvider } from "./context/AuthProvider";
import MainLayout from "./components/Layout/MainLayout/MainLayout";
import { HotelsProvider } from "./context/HotelsContext";

const App = () => {
  return (
    <AuthProvider>
      <HotelsProvider>
        <MainLayout />
      </HotelsProvider>
    </AuthProvider>
  );
};

export default App;
