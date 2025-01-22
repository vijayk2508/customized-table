import { useEffect, useRef, useState } from "react";
import { TabulatorFull as Tabulator } from "tabulator-tables";
import "tabulator-tables/dist/css/tabulator.min.css";

async function headerClick(e, column, instanceRef) {
  const currCol = column?.getDefinition?.();
  if (currCol) {
    await instanceRef.current.updateColumnDefinition(currCol.field, {
      editableTitle: true,
    });
  }
}

function getColumnsFromData(columns, instanceRef) {
  const initialColumns = columns.map((column) => ({
    title: column.title,
    field: column.field,
    editableTitle: false,
    headerClick: (e, column) => headerClick(e, column, instanceRef),
  }));

  return initialColumns;
}

const useTabulatorTable = (data) => {
  const tableContainerRef = useRef();
  const [columns, setColumns] = useState(data.columns);
  const [rows, setRows] = useState(data.rows);
  const instanceRef = useRef();

  useEffect(() => {
    debugger;
    if (!instanceRef.current && tableContainerRef.current) {
      const domEle = tableContainerRef.current;

      // Initialize Tabulator
      const table = new Tabulator(domEle, {
        data: [],
        layout: "fitColumns",
        editable: true,
        movableColumns: true,
        pagination: "local",
        paginationSize: 10,
        placeholderEmpty: "Empty",
        headerSort: false,
        columns: [],
        columnHeaderSort: false,
      });

      table.on("tableBuilt", () => {
        instanceRef.current = table;
        table?.setColumns(getColumnsFromData(columns, instanceRef));
        table?.setData(rows);
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
