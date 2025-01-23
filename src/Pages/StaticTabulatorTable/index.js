import React from "react";
import useTabulatorTable from "../../hooks/useTabulatorTable";
import useMockGetTableData from "../../hooks/useMockGetTableData";

function StaticTabulatorTable() {
  const { data, loading, error } = useMockGetTableData();

  const { tableContainerRef } = useTabulatorTable(data);

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
    <div style={{ margin: 30 }}>
      <div ref={tableContainerRef} />
    </div>
  );
}

export default StaticTabulatorTable;
