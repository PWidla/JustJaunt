import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../../context/AuthProvider";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
import "./NavBar.css";
import { Link } from "react-router-dom";

const NavBar = () => {
  const { isLoggedIn, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const toggleMenu = () => setIsOpen((prev) => !prev);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-gradient-to-r from-dark-green to-light-green p-4 font-primaryRegular">
      <div className="flex justify-between items-center w-full">
        <Link to="/">
          <div className="text-3xl font-primaryBold hover:text-yellow-700 hover:font-bold hover:underline transition duration-200">
            Just Jaunt
          </div>
        </Link>

        {/* hamburger menu btn */}
        <div className="md:hidden">
          <button
            type="button"
            onClick={toggleMenu}
            aria-label="Toggle navigation"
          >
            {isOpen ? (
              <AiOutlineClose size={30} />
            ) : (
              <AiOutlineMenu size={30} />
            )}
          </button>
        </div>

        {/* desktop menu */}
        <ul className="hidden md:flex justify-between items-center w-full max-w-[50%] mx-auto space-x-6 text-white">
          <Link to="/">
            <li className="nav-item">Home</li>
          </Link>
          <Link to="/about-us">
            <li className="nav-item">About us</li>
          </Link>

          {isLoggedIn ? (
            <>
              <Link to="/trip/create">
                <li className="nav-item">Plan a trip</li>
              </Link>
              <Link to="/my-trips">
                <li className="nav-item">My Trips</li>
              </Link>
              <li>
                <button type="button" onClick={logout} className="nav-item">
                  Log out
                </button>
              </li>
            </>
          ) : (
            <li>
              <Link to="/login">
                <button type="button" className="nav-item">
                  Log in
                </button>
              </Link>
            </li>
          )}
        </ul>

        {/* mobile menu */}
        <div
          ref={menuRef}
          className={`fixed top-0 right-0 h-full w-64 bg-light-green text-white transform ${
            isOpen ? "translate-x-0" : "translate-x-full"
          } transition-transform duration-300 ease-in-out z-50`}
        >
          <button onClick={toggleMenu} aria-label="Close menu" className="m-4">
            <AiOutlineClose size={30} />
          </button>
          <ul className="flex flex-col space-y-6 mt-8 pl-6">
            <Link to="/">
              <li className="nav-item">Home</li>
            </Link>
            <Link to="/about-us">
              <li className="nav-item">About us</li>
            </Link>
            {isLoggedIn ? (
              <>
                <Link to="/trip/create">
                  <li className="nav-item">Plan a trip</li>
                </Link>
                <Link to="/my-trips">
                  <li className="nav-item">My Trips</li>
                </Link>
                <li>
                  <button type="button" onClick={logout} className="nav-item">
                    Log out
                  </button>
                </li>
              </>
            ) : (
              <li>
                <button type="button" className="nav-item">
                  Log in
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
