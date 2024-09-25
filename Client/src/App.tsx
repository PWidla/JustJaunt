import LandingPage from "./components/Layout/LandingPage/LandingPage";
import MainLayout from "./components/Layout/MainLayout/MainLayout";
import { AuthProvider } from "./context/AuthProvider";

const App = () => {
  return (
    <AuthProvider>
      <MainLayout mainContent={<LandingPage />} />
    </AuthProvider>
  );
};

export default App;
