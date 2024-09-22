import { ReactNode } from "react";
import Footer from "../Footer/Footer";
import NavBar from "../NavBar/NavBar";

type MainLayoutProps = {
  mainContent: ReactNode;
};

const MainLayout = ({ mainContent }: MainLayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-gray-800 text-white p-4">
        <NavBar />
      </header>
      <main className="flex-grow flex items-center justify-center">
        {mainContent}
      </main>
      <footer className="bg-gray-800 text-white p-4">
        <Footer />
      </footer>
    </div>
  );
};

export default MainLayout;
