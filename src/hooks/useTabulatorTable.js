import { useEffect, useRef, useState } from "react";
import { TabulatorFull as Tabulator } from "tabulator-tables";
import "tabulator-tables/dist/css/tabulator.min.css";
import { axiosInstance } from "../services";

async function updateCol(_e, column, instanceRef, editableTitle = true) {
  try {
    const currCol = column?.getDefinition?.();
    console.log(currCol);

    if (currCol) {
      await instanceRef.current.updateColumnDefinition(currCol.field, {
        editableTitle,
      });


      if (currCol.id && !editableTitle) {
        await axiosInstance.put(`/columns/${currCol.id}`, currCol);
      }
    }
  } catch (error) {
    console.log(error);
  }
}

function getColumnsFromData(columns, instanceRef) {
  const initialColumns = columns.map((column) => ({
    ...column,
    // title: column.title,
    // field: column.field,
    editableTitle: false,
    headerClick: (e, column) => updateCol(e, column, instanceRef),
  }));

  return initialColumns;
}

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
        editable: true,
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

      table.on("columnTitleChanged", (col) => {
        console.log("columnTitleChanged", col);
        updateCol(null, col, instanceRef, false);
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

    setColumns((prevColumns) => [...prevColumns, newColumn]);

    setRows((prevRows) => {
      return prevRows.map((row) => ({ ...row, [newColumnSlug]: "" }));
    });
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
