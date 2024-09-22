import { useState } from "react";
import { useAuth } from "../../../context/AuthProvider";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";

const NavBar = () => {
  const { isLoggedIn, login, logout, signup } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="bg-gray-800 p-4">
      <div className="flex justify-between items-center w-full">
        {/* Logo */}
        <div className="text-3xl font-bold text-yellow-400 hover:text-white hover:font-bold hover:underline transition duration-200">
          Just Jaunt
        </div>

        {/* hamburger menu btn */}
        <div className="md:hidden">
          <button onClick={toggleMenu} aria-label="Toggle navigation">
            {isOpen ? (
              <AiOutlineClose size={30} />
            ) : (
              <AiOutlineMenu size={30} />
            )}
          </button>
        </div>

        {/* desktop menu */}
        <ul className="hidden md:flex justify-between items-center w-full max-w-[50%] mx-auto space-x-6 text-white">
          <li className="nav-item">Home</li>
          <li className="nav-item">How it works</li>
          {isLoggedIn ? (
            <>
              <li className="nav-item">Plan a trip</li>
              <li>
                <button onClick={logout} className="nav-item">
                  Log out
                </button>
              </li>
            </>
          ) : (
            <li>
              <button onClick={login} className="nav-item">
                Log in
              </button>
            </li>
          )}
          {!isLoggedIn && (
            <li>
              <button onClick={signup} className="nav-item">
                Sign up
              </button>
            </li>
          )}
        </ul>

        {/* mobile menu */}
        <div
          className={`fixed top-0 right-0 h-full w-64 bg-gray-900 text-white transform ${
            isOpen ? "translate-x-0" : "translate-x-full"
          } transition-transform duration-300 ease-in-out z-50`}
        >
          <button onClick={toggleMenu} aria-label="Close menu" className="m-4">
            <AiOutlineClose size={30} />
          </button>
          <ul className="flex flex-col space-y-6 mt-8 pl-6">
            <li className="nav-item">Home</li>
            <li className="nav-item">How it works</li>
            {isLoggedIn ? (
              <>
                <li className="nav-item">Plan a trip</li>
                <li>
                  <button onClick={logout} className="nav-item">
                    Log out
                  </button>
                </li>
              </>
            ) : (
              <li>
                <button onClick={login} className="nav-item">
                  Log in
                </button>
              </li>
            )}
            {!isLoggedIn && (
              <li>
                <button onClick={signup} className="nav-item">
                  Sign up
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
