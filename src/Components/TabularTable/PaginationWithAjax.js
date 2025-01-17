import React, { useRef, useState, useEffect } from "react";
import { TabulatorFull as Tabulator } from "tabulator-tables";
import "tabulator-tables/dist/css/tabulator.min.css";
import ResizeObserver from "resize-observer-polyfill";

const ReactTabulator = () => {
  const ref = useRef();
  const instanceRef = useRef();
  const resizeObserverRef = useRef();
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
            data: response.users,
            last_page,
          };
        },
        movableColumns: true,
        movableRows: true,
        layout: "fitColumns",
      });

      resizeObserverRef.current = new ResizeObserver(() => {
        if (instanceRef.current && domEle) {
          instanceRef.current.redraw(true); // Force redraw
        }
      });

      if (domEle) {
        resizeObserverRef.current.observe(domEle);
      }
    } catch (error) {
      console.error("Error initializing Tabulator:", error);
    }
  };

  useEffect(() => {
    initTabulator();

    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }
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

ReactTabulator.propTypes = {};

export default ReactTabulator;
