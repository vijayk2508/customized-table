import React from "react";
import useTabulatorTable from "../../hooks/useTabulatorTable";
import useMockGetTableData from "../../hooks/useMockGetTableData";
import Layout from "../../Layout";

function StaticTabulatorTableComp() {
  const { columnData, loading, error } = useMockGetTableData();

  const { tableContainerRef, handleDownload, handlePrint } =
    useTabulatorTable(columnData);

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
    <div style={{ margin: 30 }}>
      {tableContainerRef.current && (
        <div className="d-flex flex-wrap gap-2 mb-3">
          <button
            className="btn btn-primary"
            onClick={() => handleDownload("csv", "data.csv")}
          >
            Download CSV
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => handleDownload("json", "data.json")}
          >
            Download JSON
          </button>
          <button
            className="btn btn-success"
            onClick={() =>
              handleDownload("xlsx", "data.xlsx", { sheetName: "My Data" })
            }
          >
            Download XLSX
          </button>
          <button
            className="btn btn-warning"
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
            className="btn btn-info"
            onClick={() => handleDownload("html", "data.html", { style: true })}
          >
            Download HTML
          </button>

          <button className="btn btn-info" onClick={handlePrint}>
            Print
          </button>
        </div>
      )}

      <div ref={tableContainerRef} style={{ overflowX: "auto" }} />
    </div>
  );
}

const StaticTabulatorTable = () => (
  <Layout>
    <StaticTabulatorTableComp />
  </Layout>
);

export default StaticTabulatorTable;
