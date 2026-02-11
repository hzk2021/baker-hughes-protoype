import { createBrowserRouter, Navigate } from "react-router";
import { Layout } from "./components/Layout";
import { PlannerList } from "./components/PlannerList";
import { PlannerDetail } from "./components/PlannerDetail";
import { PickerList } from "./components/PickerList";
import { PickerDetail } from "./components/PickerDetail";
import { PackerList } from "./components/PackerList";
import { PackerDetail } from "./components/PackerDetail";
import { ShipperList } from "./components/ShipperList";
import { ShipperDetail } from "./components/ShipperDetail";
import { ManagementDashboard } from "./components/ManagementDashboard";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      {
        index: true,
        element: <Navigate to="/planner" replace />,
      },
      {
        path: "planner",
        element: <PlannerList />,
      },
      {
        path: "planner/:id",
        element: <PlannerDetail />,
      },
      {
        path: "picker",
        element: <PickerList />,
      },
      {
        path: "picker/:id",
        element: <PickerDetail />,
      },
      {
        path: "packer",
        element: <PackerList />,
      },
      {
        path: "packer/:id",
        element: <PackerDetail />,
      },
      {
        path: "shipper",
        element: <ShipperList />,
      },
      {
        path: "shipper/:id",
        element: <ShipperDetail />,
      },
      {
        path: "management",
        element: <ManagementDashboard />,
      },
    ],
  },
]);