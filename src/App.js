import React from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import StaticTabulatorTable from "./Pages/StaticTabulatorTable";
// import LandingPage from "./Pages/TabulatorTables/LandingPage";
// import AddTable from "./Pages/TabulatorTables/AddTable";
// import Table from "./Pages/TabulatorTables/Table";

function App() {
  return (
    <BrowserRouter>
      <Routes>
      <Route path="/" element={<StaticTabulatorTable />} />
        {/* <Route path="/" element={<LandingPage />} />
        <Route path="/add-table" element={<AddTable />} />
        <Route path="/table/:id" element={<Table />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
