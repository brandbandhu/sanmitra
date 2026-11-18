import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import { routes } from "./router";
import "./styles.css";

createRoot(document.getElementById("root")!).render(
  <RouterProvider router={createBrowserRouter(routes)} />,
);
