import axios from "axios";
import React, { useEffect, useRef } from "react";
import { TabulatorFull as Tabulator } from "tabulator-tables";
import "tabulator-tables/dist/css/tabulator.min.css";

const paginationSize = 10;
const TableWithMockAPI = () => {
  const tableRef = useRef(null);

  useEffect(() => {
    const table = new Tabulator(tableRef.current, {
      layout: "fitColumns",
      pagination: "remote", // Set pagination mode to remote
      paginationSize: paginationSize, // Items per page
      paginationSizeSelector: [5, 10, 20, 50, 100],
      columns: [
        { title: "#", field: "index", width: 50 },
        { title: "ID", field: "id", width: 100 },
        { title: "First Name", field: "firstName", width: 200 },
      ],
      ajaxURL: "/api/users", // Required for ajax calls
      ajaxConfig: "GET", // HTTP method for ajax calls
      ajaxParams: {}, // Optional additional params
      ajaxFiltering: true, // Enable filtering (optional)
      ajaxSorting: true, // Enable sorting (optional)
      ajaxRequestFunc: async (url, config, params) => {
        console.log("ajaxRequestFunc triggered", { url, config, params });

        // Mock API call
        try {
          const response = await axios.get("/api/users", {
            params: {
              page: params.page || 1, // Current page number
              limit: params.limit || paginationSize, // Page limit
            },
          });

          console.log("API Response:", response.data.data);

          return response.data.data;
        } catch (error) {
            return []
        }
      },
      ajaxResponse: async function (url, params, response) {
        return  response.data
        // const size = params.size || 10; // Use the selected page size
        // const last_page = Math.ceil(response.total / size); // Calculate total pages
        // return {
        //   data: response.data,
        //   last_page,
        // };

        // return {
        //   data:,
        //   last_page,
        // };
      },
      ajaxURLGenerator: async function (url, config, params) {
        console.log("ajaxURLGenerator", {
          url,
          config,
          params,
        });
      },
    });

    return () => table.destroy(); // Cleanup Tabulator instance on unmount
  }, []);

  return <div ref={tableRef}></div>;
};

export default TableWithMockAPI;
