import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import WelcomePage from "./pages/WelcomePage.tsx";
import SignUpPage from "./pages/SignUpPage.tsx";
import Homepage from "./pages/HomePage.tsx";
import ForgotPassPage from "./pages/ForgotPassPage.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <WelcomePage />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassPage />,
  },
  {
    path: "/login",
    element: <WelcomePage />,
  },
  {
    path: "/signup",
    element: <SignUpPage />,
  },
  {
    path: "/homepage",
    element: <Homepage />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
