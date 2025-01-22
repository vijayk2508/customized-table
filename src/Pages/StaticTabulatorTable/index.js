import React from "react";
import useTabulatorTable from "../../hooks/useTabulatorTable";
import useMockGetTableData from "../../hooks/useMockGetTableData";

function StaticTabulatorTable() {
  const { data, loading, error } = useMockGetTableData();

  const { tableContainerRef, handleAddColumn, mainId } = useTabulatorTable(
    data
  );

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
    <div>
      <h1>{data.tableName}</h1>
      <button onClick={handleAddColumn}>Add Column</button>
      <div ref={tableContainerRef} data-instance={mainId} />
    </div>
  );
}

export default StaticTabulatorTable;
