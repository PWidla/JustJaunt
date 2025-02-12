import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import LandingPage from "../pages/LandingPage/LandingPage";
import AboutPage from "../pages/AboutPage/AboutPage";
import PlanTripPage from "../pages/PlanTripPage/PlanTripPage";
import TripDetailsPage from "../pages/TripDetailsPage/TripDetailsPage";
import LogInPage from "../pages/LogInPage/LogInPage";
import ProtectedRoute from "./ProtectedRoute";
import MyTripsPage from "../pages/MyTripsPage/MyTripsPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "", element: <LandingPage /> },
      { path: "about-us", element: <AboutPage /> },
      {
        path: "/trip/create",
        element: (
          <ProtectedRoute>
            <PlanTripPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/my-trips",
        element: (
          <ProtectedRoute>
            <MyTripsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/trip/:tripId",
        element: <TripDetailsPage />,
      },
      { path: "login", element: <LogInPage /> },
    ],
  },
]);
