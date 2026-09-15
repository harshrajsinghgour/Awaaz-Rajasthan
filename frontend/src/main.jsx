import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./style.css";

/*
========================================================
  AWAAZ RAJASTHAN
  Professional News Portal
  React Application Entry Point
========================================================
*/

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error(
    "Awaaz Rajasthan: Root element #root नहीं मिला।"
  );
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
