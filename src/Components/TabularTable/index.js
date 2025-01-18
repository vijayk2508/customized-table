import React, { useRef, useEffect, useState } from "react";
import axios from "axios";
import { TabulatorFull as Tabulator } from "tabulator-tables";
import "tabulator-tables/dist/css/tabulator.min.css";

const ReactTabulator = ({ limit: set_limit = 10, skip: set_skip = 0 }) => {
  const [limit] = useState(set_limit);
  const [skip, setSkip] = useState(set_skip);
  const lastFetchedPage = useRef(null);
  const tableRef = useRef(null);
  const instanceRef = useRef(null);

  const fetchData = async (page) => {
    try {
      const response = await axios.get("/api/users", {
        params: {
          limit: limit,
          skip: skip,
          page,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
      return { data: [], total: 0 };
    }
  };

  const initTabulator = async () => {
    if (!tableRef.current) {
      console.error("Tabulator container is not ready.");
      return;
    }

    try {
      const table = new Tabulator(tableRef.current, {
        ajaxURL: "/",
        layout: "fitColumns",
        pagination: "remote",
        paginationSize: set_limit,
        paginationSizeSelector: [5, 10, 20, 50, 100, 200],
        columns: [
          { title: "", field: "index", width: 50 },
          { title: "ID", field: "id", width: 50 },
          { title: "First Name", field: "firstName" },
        ],
        mockAPI: true,
      });

      instanceRef.current = table;
    } catch (error) {
      console.error("Error initializing Tabulator:", error);
    }
  };

  useEffect(() => {
    if (tableRef.current) {
      initTabulator();
    }

    return () => {
      if (instanceRef.current) {
        instanceRef.current.destroy();
      }
    };
  }, []);

  return (
    <div>
      <h1>Tabulator Example</h1>
      <div ref={tableRef} style={{ marginTop: "20px", height: "400px" }} />
    </div>
  );
};

export default ReactTabulator;