import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import "./assets/css/load-universal-styles.css";
import SigninPage from "./pages/SigninPage.tsx";
import RegisterPage from "./pages/RegisterPage.tsx";
import Homepage from "./pages/HomePage.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <SigninPage />,
  },
  {
    path: "/login",
    element: <SigninPage />,
  },
  {
    path: "/signup",
    element: <RegisterPage />,
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
