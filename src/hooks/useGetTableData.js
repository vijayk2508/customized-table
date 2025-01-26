import { useState, useEffect } from "react";

import { useParams } from "react-router";
import { axiosInstance } from "../services";
import API_URLS from "../services/API_URLS";

/**
 * Custom hook to fetch table data based on the table ID.
 *
 * @param {string} tableId - The ID of the table to fetch.
 * @returns {object} - An object containing the table data, loading state, and any error.
 */
const useGetTableData = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mainId] = useState(
    `tabulator-${+new Date()}-${Math.floor(Math.random() * 9999999)}${id}`
  );

  useEffect(() => {
    const fetchTableData = async () => {
      try {
        const response = await axiosInstance.get(
          `${API_URLS.TABLES.GET_TABLE_BY_ID}${id}`
        );
        setData(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch data");
        setLoading(false);
      }
    };

    if (id) {
      fetchTableData();
    }
  }, [id]);

  return { data, loading, error, id, mainId };
};

export default useGetTableData;
