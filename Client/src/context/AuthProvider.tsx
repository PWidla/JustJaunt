import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { IUser } from "../../../Server/src/models/user";

type AuthContextType = {
  isLoggedIn: boolean;
  loggedInUser: IUser | null;
  login: (user: IUser) => void;
  logout: () => void;
  signup: (user: IUser) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState<IUser | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("loggedInUser"); //mvp purpose. to do: check if has an effect on efficiency
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setLoggedInUser(user);
      setIsLoggedIn(true);
    }
  }, []);

  const login = (user: IUser) => {
    console.log("Login:", user);
    setIsLoggedIn(true);
    setLoggedInUser(user);
    localStorage.setItem("loggedInUser", JSON.stringify(user));
    console.log("loggedInUser");
    console.log(localStorage.getItem("loggedInUser"));
  };

  const logout = () => {
    console.log("Logout");
    setIsLoggedIn(false);
    setLoggedInUser(null);
  };

  const signup = (user: IUser) => {
    setIsLoggedIn(true);
    setLoggedInUser(user);
  };

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, loggedInUser, login, logout, signup }}
    >
      {children}
    </AuthContext.Provider>
  );
};
