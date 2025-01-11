import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import LandingPage from "../pages/LandingPage/LandingPage";
import AboutPage from "../pages/AboutPage/AboutPage";
import PlanTripPage from "../pages/PlanTripPage/PlanTripPage";
import LogInPage from "../pages/LogInPage/LogInPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "", element: <LandingPage /> },
      { path: "about-us", element: <AboutPage /> },
      { path: "/trip/create", element: <PlanTripPage /> },
      { path: "login", element: <LogInPage /> },
    ],
  },
]);
