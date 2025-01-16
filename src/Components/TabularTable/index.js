import React, { useRef, useState, useEffect } from "react";
import { TabulatorFull as Tabulator } from "tabulator-tables";
import "tabulator-tables/dist/css/tabulator.min.css";

const ReactTabulator = () => {
  const ref = useRef();
  const instanceRef = useRef();
  const [mainId] = useState(
    `tabulator-${+new Date()}-${Math.floor(Math.random() * 9999999)}`
  );

  const initTabulator = async () => {
    const domEle = ref.current;

    try {
      instanceRef.current = new Tabulator(domEle, {
        ajaxURL: "https://dummyjson.com/users",
        columns: [
          { title: "Id", field: "id" },
          { title: "FirstName", field: "firstName" },
          { title: "Gender", field: "gender" },
          { title: "Email", field: "email" },
          { title: "Age", field: "age" },
        ],
        pagination: true, //enable pagination
        paginationSize: 5,
        paginationMode: "remote", //enable remote pagination
        ajaxURLGenerator: function (url, config, params) {
          const { page = 1, size = 5 } = params;
          const skip = (page - 1) * size;
          return url + `?skip=${skip}&limit=${size}`;
        },
        ajaxResponse: function (url, params, response) {
          // Must configure with server side
          let last_page = Math.ceil(response.total / params.size);
          return {
            data: response.users,
            last_page,
          };
        },
      });
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

  return <>
    <div>
      <h1>Tabulator Table</h1>
    </div>

    <div ref={ref} data-instance={mainId} />
  </>;
};

ReactTabulator.propTypes = {};

export default ReactTabulator;