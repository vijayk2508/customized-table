import { useState, useEffect } from "react";
import { getTableColumnData } from "../services/tableService"; 

/**
 * Custom hook to fetch table data based on the table ID.
 *
 * @param {string} tableId - The ID of the table to fetch.
 * @returns {object} - An object containing the table data, loading state, and any error.
 */
const useMockGetTableData = () => {
  const [columnData, setColumnData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mainId] = useState(
    `tabulator-${+new Date()}-${Math.floor(Math.random() * 9999999)}`
  );

  useEffect(() => {
    const fetchTableColumnData = async () => {
      try {
        const columnData = await getTableColumnData();
        setColumnData(columnData);
        setLoading(false);
      } catch (err) {
        debugger;
        setError("Failed to fetch data");
        setLoading(false);
      }
    };

    fetchTableColumnData();
  }, []);

  return { columnData, loading, error, mainId };
};

export default useMockGetTableData;
