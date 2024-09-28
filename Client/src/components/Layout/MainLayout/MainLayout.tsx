import { Outlet } from "react-router";
import Footer from "../Footer/Footer";
import NavBar from "../NavBar/NavBar";

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-gradient-to-r from-dark-green to-light-green text-white p-4">
        <NavBar />
      </header>
      <main className="flex-grow flex items-center justify-center">
        <Outlet />
      </main>
      <footer className="bg-gradient-to-r from-dark-green to-light-green text-white p-4">
        <Footer />
      </footer>
    </div>
  );
};

export default MainLayout;
