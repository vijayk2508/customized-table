import { useEffect, useRef, useState } from "react";
import { TabulatorFull as Tabulator } from "tabulator-tables";
import "tabulator-tables/dist/css/tabulator.min.css";
import {
  //cellClick,
  cellEdited,
  getColumnsFromData,
  updateCol,
} from "../Library/TabulatorLib/TabulatorHelper";
import { saveNewColumn } from "../services/tableService";

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
    try {
      const newColumnSlug = `new_column_${columns.length + 1}`;

      const newColumn = {
        id: columns.length + 1,
        title: `New Column ${columns.length + 1}`,
        field: newColumnSlug,
        editor: "input",
        editable: true,
      };

      // Add new column to the table
      instanceRef.current.addColumn(
        {
          ...newColumn,
          headerClick: (e, column) => updateCol(e, column, instanceRef),
        },
        false,
        newColumn.field
      );

      // Update rows to include the new column
      const updatedRows = instanceRef.current.getRows().map((row) => {
        const rowData = row.getData();
        return {
          ...rowData,
          [newColumnSlug]: rowData[newColumnSlug] || "", // Add new column with default value
        };
      });

      // Update state
      setColumns((prevColumns) => [...prevColumns, newColumn]);
      setRows(updatedRows);
      instanceRef.current.setData(updatedRows);

      const columnLayout = instanceRef.current.getColumnLayout();
      const columnMapping = columnLayout.reduce((acc, curr) => {
        acc[curr.field] = curr.id;
        return acc;
      }, {});

      // Populate the field object using column IDs
      const rows = instanceRef.current.getRows();

      let formattedRows = [];

      rows.forEach((row) => {
        const rowData = row.getData();

        const formattedRowData = {
          id: rowData.id,
          field: {},
          tableId: rowData.tableId,
        };

        for (const key in rowData) {
          if (key !== "id" && key !== "tableId" && columnMapping[key]) {
            formattedRowData.field[columnMapping[key]] = {
              value: rowData?.[key] || "",
            };
          }
        }

        formattedRows.push(formattedRowData);
      });

      saveNewColumn(newColumn, formattedRows);
    } catch (error) {
      console.error("Error adding new column:", error);
    }
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
