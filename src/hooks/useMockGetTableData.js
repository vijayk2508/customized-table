import { useState, useEffect } from "react";
import { getTableData } from "../services/tableService"; 

/**
 * Custom hook to fetch table data based on the table ID.
 *
 * @param {string} tableId - The ID of the table to fetch.
 * @returns {object} - An object containing the table data, loading state, and any error.
 */
const useMockGetTableData = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mainId] = useState(
    `tabulator-${+new Date()}-${Math.floor(Math.random() * 9999999)}`
  );

  useEffect(() => {
    const fetchTableData = async () => {
      try {
        const data = await getTableData();
        setData(data);
        setLoading(false);
      } catch (err) {
        debugger;
        setError("Failed to fetch data");
        setLoading(false);
      }
    };

    fetchTableData();
  }, []);

  return { data, loading, error, mainId };
};

export default useMockGetTableData;
