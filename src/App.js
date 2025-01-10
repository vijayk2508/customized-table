import React, { useEffect } from "react";
import CustomizeTable from "./CustomizeTable";
import { makeData } from "./fakeDate/makeData";

function App() {
  const fetchData = async () => {
    return await new Promise((resolve) => {
      setTimeout(() => {
        resolve(makeData(20));
      }, 2000);
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div data-testid="customize-table" className="container">
      <CustomizeTable fetchData={fetchData}/>
    </div>
  );
}

export default App;
