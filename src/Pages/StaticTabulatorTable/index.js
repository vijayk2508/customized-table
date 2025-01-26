import React from "react";
import useTabulatorTable from "../../hooks/useTabulatorTable";
import useMockGetTableData from "../../hooks/useMockGetTableData";
import Layout from "../../Layout";

function StaticTabulatorTable() {
  const { columnData, loading, error } = useMockGetTableData();

  const { tableContainerRef } = useTabulatorTable(columnData);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!columnData) {
    return <div>No data found</div>;
  }

  return (
    <Layout>
      <div style={{ margin: 30 }}>
        <div ref={tableContainerRef} />
      </div>
    </Layout>
  );
}

export default StaticTabulatorTable;
