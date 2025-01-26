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

  const handleDownload = (format, fileName, options = {}) => {
    try {
      tableContainerRef.current?.download?.(format, fileName, options);
    } catch (error) {}
  };

  return (
    <Layout>
      <div style={{ margin: 30 }}>
        <div>
          <button onClick={() => handleDownload("csv", "data.csv")}>
            Download CSV
          </button>
          <button onClick={() => handleDownload("json", "data.json")}>
            Download JSON
          </button>
          <button
            onClick={() =>
              handleDownload("xlsx", "data.xlsx", { sheetName: "My Data" })
            }
          >
            Download XLSX
          </button>
          <button
            onClick={() =>
              handleDownload("pdf", "data.pdf", {
                orientation: "portrait",
                title: "Example Report",
              })
            }
          >
            Download PDF
          </button>
          <button
            onClick={() => handleDownload("html", "data.html", { style: true })}
          >
            Download HTML
          </button>
        </div>
        <div ref={tableContainerRef} />
      </div>
    </Layout>
  );
}

export default StaticTabulatorTable;
