import PropTypes from "prop-types";
import React, { useRef, useEffect, useState } from "react";
import { TabulatorFull as Tabulator } from "tabulator-tables";
import "tabulator-tables/dist/css/tabulator.min.css";
import axios from "axios";

const ReactTabulator = ({ limit: set_limit = 10, skip: set_skip = 0 }) => {
  const [currPage, setCurrPage] = useState(1);
  const [limit] = useState(set_limit);
  const [skip] = useState(set_skip);
  const [tableStatus, setTableStatus] = useState("");

  const tableRef = useRef(null);
  const instanceRef = useRef(null);

  // Fetch data using Axios
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
    }
  };

  // Initialize Tabulator
  const initTabulator = async () => {
    if (!tableRef.current) {
      console.error("Tabulator container is not ready.");
      return;
    }

    try {
      const table = new Tabulator(tableRef.current, {
        data: [],
        layout: "fitColumns",
        pagination: true,
        paginationSize: set_limit,
        paginationSizeSelector: [5, 10, 20, 50, 100, 200],
        columns: [
          { title: "#", field: "index", width: 20, headerSort: true },
          { title: "ID", field: "id", width: 50 },
          { title: "First Name", field: "firstName" },
        ],
        paginationMode: "remote",
        paginationButtonCount: 5,
      });

      table.on("tableBuilt", async (...args) => {
        setTableStatus("tableBuilt");

        const response = await fetchData();
        const last_page = Math.ceil(response.total / limit);

        table.setPageSize(limit);
        table.setMaxPage(last_page);
        table.setPage(1);
        table.replaceData(response.data);
      });

      table.on("renderComplete", async () => {
        const page = table.getPage();

        setTableStatus("renderStarted");
        setCurrPage(page);
      });

      instanceRef.current = table;
    } catch (error) {
      console.error("Error initializing Tabulator:", error);
    }
  };

  async function loadTableData(currPage) {
    debugger;
    if (!instanceRef.current || tableStatus !== "renderStarted") return;

    const response = await fetchData(currPage);
    const last_page = Math.ceil(response.total / limit);

    instanceRef.current.setPageSize(limit);
    instanceRef.current.setMaxPage(last_page);
    instanceRef.current.setPage(currPage);
    instanceRef.current.replaceData(response.data);
  }

  useEffect(() => {
    if (currPage) {
      loadTableData(currPage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currPage]);

  // Initialize Tabulator on component mount
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

ReactTabulator.propTypes = {
  limit: PropTypes.number,
  skip: PropTypes.number,
};

export default ReactTabulator;
