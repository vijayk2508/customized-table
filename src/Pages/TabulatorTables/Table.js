import React from "react";
import useGetTableData from "../../hooks/useGetTableData";
import useTabulatorTable from "../../hooks/useTabulatorTable"; // Import the hook

const TableComponent = () => {
  const { data, loading, error } = useGetTableData();
  const { tableContainerRef, handleAddColumn, mainId } = useTabulatorTable(data); // Use the custom hook for Tabulator

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
};

export default TableComponent;
