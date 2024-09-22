import { useAuth } from "../../../context/AuthProvider";
import "./NavBar.css";

const NavBar = () => {
  const { isLoggedIn, login, logout, signup } = useAuth();

  return (
    <ul className="flex justify-between items-center max-w-[50%] mx-auto">
      <li className="text-3xl font-bold text-yellow-400 hover:text-white hover:font-bold hover:underline transition duration-200">
        Just Jaunt
      </li>

      <li className="nav-item">Home</li>
      <li className="nav-item">How it works</li>
      {isLoggedIn ? (
        <>
          <li className="nav-item">Plan a trip</li>
          <li className="nav-item">
            <button onClick={logout}>Log out</button>
          </li>
        </>
      ) : (
        <li className="nav-item">
          <button onClick={login}>Log in</button>
        </li>
      )}
      {!isLoggedIn && (
        <li className="nav-item">
          <button onClick={signup}>Sign up</button>
        </li>
      )}
    </ul>
  );
};

export default NavBar;
