import { useEffect, useRef, useState } from "react";
import { TabulatorFull as Tabulator } from "tabulator-tables";
import "tabulator-tables/dist/css/tabulator.min.css";
import {
  //cellClick,
  cellEdited,
  getColumnsFromData,
  updateCol,
} from "../Library/TabulatorLib/TabulatorHelper";
//import { saveNewColumn } from "../services/tableService";

const useTabulatorTable = (data) => {
  const tableContainerRef = useRef();
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const instanceRef = useRef();

  useEffect(() => {
    if (data) {
      setColumns(data.columns);
      setRows(data.rows);
    }
  }, [data]);

  useEffect(() => {
    if (!instanceRef.current && tableContainerRef.current) {
      const domEle = tableContainerRef.current;

      // Initialize Tabulator
      const table = new Tabulator(domEle, {
        data: [],
        columns: [],
        layout: "fitColumns",
        movableColumns: true,
        pagination: "local",
        paginationSize: 10,
        placeholderEmpty: "Empty",
        headerSort: false,
        columnHeaderSort: false,
      });

      table.on("tableBuilt", () => {
        instanceRef.current = table;
        table?.setColumns(getColumnsFromData(columns, instanceRef));
        table?.setData(rows);
      });

      table.on("columnTitleChanged", (col) =>
        updateCol(null, col, instanceRef, false)
      );

      // table.on("cellClick", (e, cell) => {
      //   cellClick(cell, instanceRef);
      // });

      table.on("cellEdited", (cell) => {
        cellEdited(cell);
      });
    }
  }, [columns, rows]);

  // Function to handle adding a new column
  const handleAddColumn = () => {
    const newColumnSlug = `new_column_${columns.length + 1}`;

    const newColumn = {
      title: `New Column ${columns.length + 1}`,
      field: newColumnSlug,
      editableTitle: false,
    };
    instanceRef.current.addColumn(newColumn, true, newColumn.field);

    setColumns((prevColumns) => [...prevColumns, newColumn]);

    // setRows((prevRows) => {
    //   const getAllRows = prevRows.map((row) => ({
    //     ...row,
    //     [newColumnSlug]: "New",
    //   }));

    //   const columnLayout = instanceRef.current.getColumnLayout();

    //   const columnMapping = columnLayout.reduce((acc, curr) => {
    //     acc[curr.field] = curr.id; // Map field names to their corresponding column IDs
    //     return acc;
    //   }, {});

    //   const updatedRows = [];
    //   getAllRows.forEach((rowData) => {
    //     const formattedRowData = {
    //       id: rowData.id,
    //       field: {}, // Initialize an empty field object
    //       tableId: rowData.tableId,
    //     };

    //     for (const key in rowData) {
    //       if (key !== "id" && key !== "tableId" && columnMapping[key]) {
    //         formattedRowData.field[columnMapping[key]] = {
    //           value: rowData[key],
    //         };
    //       }
    //     }

    //     updatedRows.push(formattedRowData);
    //   });

    //   // Populate the `field` object using column IDs

    //   // Save the new column to the backend
    //   //saveNewColumn(newColumn, updatedRows); // Update this line

    //   return updatedRows;
    // });
  };

  return {
    tableContainerRef,
    handleAddColumn,
    loading: !data,
    columns,
    rows,
  };
};

export default useTabulatorTable;
