import React, { useRef, useState, useEffect } from "react";
import { TabulatorFull as Tabulator } from "tabulator-tables";
import "tabulator-tables/dist/css/tabulator.min.css";
import axios from "axios";

const baseURL = "https://customized-table-backend.vercel.app/api";

const API = {
  USER: {
    GET_ALL_USERS: `/users`,
    GET_USER_BY_ID: `/users/`,
    UPDATE_USER_BY_ID: `/users/`,
    ADD_USER: `/users/`,
  },
};

const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
};

const axiosInstance = axios.create({ baseURL, headers });

const FullTabulatorTable = () => {
  const ref = useRef();
  const instanceRef = useRef();
  const [mainId] = useState(
    `tabulator-${+new Date()}-${Math.floor(Math.random() * 9999999)}`
  );

  const initTabulator = async () => {
    const domEle = ref.current;

    try {
      const table = new Tabulator(domEle, {
        ajaxURL: `${baseURL}${API.USER.GET_ALL_USERS}`,
        ajaxConfig: { headers },
        columns: [
          {
            title: "Index",
            formatter: "rownum",
            hozAlign: "center",
            width: 100,
          },
          { title: "Index Order", field: "index", editor: "input" },
          { title: "Id", field: "_id" },
          { title: "FirstName", field: "firstName", editor: "input" },
          { title: "Gender", field: "gender", editor: "input" },
          { title: "Email", field: "email", editor: "input" },
          { title: "Age", field: "age", editor: "input" },
        ],
        pagination: true, // Enable pagination
        paginationSize: 10, // Default pagination size
        paginationSizeSelector: [5, 10, 20, 50, 100], // Allow dynamic page size selection
        paginationMode: "remote", // Enable remote pagination
        ajaxURLGenerator: function (url, config, params) {
          const { page = 1, size = 10 } = params; // Use the correct size
          const skip = (page - 1) * size; // Calculate the skip value
          return `${url}?skip=${skip}&limit=${size}`; // Generate URL with skip and limit
        },
        ajaxResponse: function (url, params, response) {
          const size = params.size || 10; // Use the selected page size
          const last_page = Math.ceil(response.total / size); // Calculate total pages
          return {
            data: response.data,
            last_page,
          };
        },
        movableColumns: true,
        movableRows: true,
        layout: "fitDataStretch",
      });

      // Add cellEdited event listener
      table.on("cellEdited", async function (cell, ...args) {
        console.log(args);

        const updatedData = cell.getRow().getData();
        console.log("Cell Edited:", updatedData);

        try {
          const URL = `${API.USER.UPDATE_USER_BY_ID}${updatedData._id}`;
          await axiosInstance.put(URL, updatedData);
        } catch (error) {
          console.error("Error updating data:", error);
        }
      });

      instanceRef.current = table;
    } catch (error) {
      console.error("Error initializing Tabulator:", error);
    }
  };

  useEffect(() => {
    initTabulator();

    return () => {
      if (instanceRef.current) {
        instanceRef.current.destroy();
      }
    };
  }, []);

  return (
    <>
      <div>
        <h1>Tabulator Table</h1>
      </div>
      <div ref={ref} data-instance={mainId} />
    </>
  );
};

FullTabulatorTable.propTypes = {};

export default FullTabulatorTable;
