import React from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import StaticTabulatorTable from "./Pages/StaticTabulatorTable";
import ReactGrid from "./Pages/ReactGrid";

function App() {
  return (
    <BrowserRouter>
      <Routes>
      <Route path="/" element={<StaticTabulatorTable />} />
      <Route path="/reactgrid" element={<ReactGrid />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
