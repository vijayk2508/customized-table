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
    DELETE_USER_BY_ID: `/users/`, // Add DELETE endpoint
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
          {
            title: "Actions",
            formatter: "buttonCross",
            width: 100,
            align: "center",
            cellClick: async (e, cell) => {
              const rowData = cell.getRow().getData();
              try {
                const URL = `${API.USER.DELETE_USER_BY_ID}${rowData._id}`;
                await axiosInstance.delete(URL);
                cell.getRow().delete();
              } catch (error) {
                console.error("Error deleting data:", error);
              }
            },
          },
        ],
        pagination: true,
        paginationSize: 10,
        paginationSizeSelector: [5, 10, 20, 50, 100],
        paginationMode: "remote",
        ajaxURLGenerator: function (url, config, params) {
          const { page = 1, size = 10 } = params;
          const skip = (page - 1) * size;
          return `${url}?skip=${skip}&limit=${size}`;
        },
        ajaxResponse: function (url, params, response) {
          const size = params.size || 10;
          const last_page = Math.ceil(response.total / size);
          return {
            data: response.data,
            last_page,
          };
        },
        movableColumns: true,
        movableRows: true,
        layout: "fitDataStretch",
      });

      table.on("cellEdited", async function (cell) {
        const updatedData = cell.getRow().getData();
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

  const handleAddRow = async () => {
    const newUser = {
      index: "",
      firstName: "",
      gender: "",
      email: "",
      age: "",
    };
    try {
      const response = await axiosInstance.post(API.USER.ADD_USER, newUser);
      instanceRef.current.addData([response.data], true);
    } catch (error) {
      console.error("Error adding new user:", error);
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
        <button onClick={handleAddRow}>Add Row</button>
      </div>
      <div ref={ref} data-instance={mainId} />
    </>
  );
};

export default FullTabulatorTable;
