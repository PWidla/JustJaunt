import { AuthProvider } from "./context/AuthProvider";
import MainLayout from "./components/Layout/MainLayout/MainLayout";

const App = () => {
  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  );
};

export default App;
