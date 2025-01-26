import React from "react";
import { Routes, Route } from "react-router";
import StaticTabulatorTable from "./Pages/StaticTabulatorTable";
import ReactGrid from "./Pages/ReactGrid";

function App() {
  return (
    <Routes>
      <Route path="/" element={<StaticTabulatorTable />} />
      <Route path="/reactgrid" element={<ReactGrid />} />
    </Routes>
  );
}

export default App;
