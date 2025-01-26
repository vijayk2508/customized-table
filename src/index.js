import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import "./style/tabulator-table.css";
import { BrowserRouter } from "react-router";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter
      basename={window.BASEPATH === "__CUSTOM_BASEPATH__" ? "/" : window.BASEPATH}
    >
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
