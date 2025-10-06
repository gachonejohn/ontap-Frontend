import React from "react";
import { createRoot } from "react-dom/client";

import { ReduxProvider } from "./store/provider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import App from "./App";
import "./index.css";
import "./styles/css/fonts.css"
import "./styles/css/style.css"
createRoot(document.getElementById("root")).render(
  <ReduxProvider>
  <ToastContainer
  position="top-right"
  autoClose={3000}
  hideProgressBar={false}
  closeOnClick
  pauseOnHover
  draggable
  pauseOnFocusLoss
  theme="colored"
  toastClassName={({ type }) => {
    const base =
      "relative flex p-3 rounded-lg justify-between overflow-hidden cursor-pointer";
    const typeClasses = {
      success: "bg-green-100 text-green-600",
      error: "bg-red-100 text-red-600",
      info: "bg-blue-100 text-blue-600",
      warning: "bg-yellow-100 text-yellow-600",
      default: "bg-gray-100 text-gray-700",
    };
    return `${base} ${typeClasses[type] || typeClasses.default}`;
  }}
  bodyClassName={() => "text-sm font-medium"}
/>

    <App />
  </ReduxProvider>
);
