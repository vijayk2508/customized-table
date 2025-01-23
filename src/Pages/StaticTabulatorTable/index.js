import React from "react";
import useTabulatorTable from "../../hooks/useTabulatorTable";
import useMockGetTableData from "../../hooks/useMockGetTableData";

function StaticTabulatorTable() {
  const { data, loading, error } = useMockGetTableData();

  const { tableContainerRef, handleAddColumn, handleRemoveRows, selectedRows } =
    useTabulatorTable(data);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!data) {
    return <div>No data found</div>;
  }

  return (
    <div style={{margin : 30}}>
      <h1>{data.tableName}</h1>
      <button onClick={handleAddColumn}>Add Column</button>
      <button
        onClick={handleRemoveRows}
        disabled={selectedRows.length === 0} // Disable if no rows are selected
      >
        Remove Selected Rows
      </button>
      <div ref={tableContainerRef} />
    </div>
  );
}

export default StaticTabulatorTable;
