import React from "react";
import useTabulatorTable from "../../hooks/useTabulatorTable";

const data = {
  tableName: "Table 1",
  columns: [
    {
      title: "Name",
      field: "name",
    },
    {
      title: "Age",
      field: "age",
    },
  ],
  rows: [
    {
      name: "John Doe",
      age: 30,
    },
    {
      name: "Jane Doe",
      age: 25,
    },
  ],
};

function StaticTabulatorTable() {
  const { tableContainerRef, handleAddColumn, mainId } =
    useTabulatorTable(data);

  if (!data) {
    return <div>No data found</div>;
  }

  return (
    <div>
      <h1>{data.tableName}</h1>
      <button onClick={handleAddColumn}>Add Column</button>
      <div ref={tableContainerRef} data-instance={mainId} />
    </div>
  );
}

export default StaticTabulatorTable;
