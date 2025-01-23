import { useEffect, useRef, useState } from "react";
import { TabulatorFull as Tabulator } from "tabulator-tables";
import "tabulator-tables/dist/css/tabulator.min.css";
import {
  cellContextMenu,
  cellEdited,
  setColHeaderMenu,
  setFormattedCol,
  setHeaderNonEditable,
  updateCol,
  zerothCol,
} from "../Library/TabulatorLib/TabulatorHelper";
import { saveNewColumn } from "../services/tableService";

const useTabulatorTable = (data) => {
  const tableContainerRef = useRef();
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]); // State to store selected rows
  const editingColumn = useRef(null);
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

      const table = new Tabulator(domEle, {
        data: [],
        columns: [],
        layout: "fitColumns",
        movableColumns: true,
        pagination: "local",
        paginationSize: 10,
        placeholderEmpty: "Empty",
        rowContextMenu1: [
          {
            label: "Delete Row",
            action: function (e, row) {
              row.delete();
            },
          },
          {
            separator: true,
          },
          {
            disabled: true,
            label: "Add 1 row above",
            action: function () {
              console.log("Add 1 row above", arguments);
            },
          },
          {
            separator: true,
          },
          {
            disabled: true,
            label: "Add 1 row below",
            action: function () {
              console.log("Add 1 row below", arguments);
            },
          },
        ],
        autoColumns: false,
      });

      table.on("tableBuilt", () => {
        instanceRef.current = table;

        const initialColumns = columns.map((column) =>
          setFormattedCol(column, editingColumn, instanceRef)
        );

        initialColumns.unshift(zerothCol(instanceRef));

        table?.setColumns(initialColumns);
        table?.setData(rows);

        setColHeaderMenu(instanceRef);
      });

      table.on("rowSelectionChanged", function () {
        console.log(arguments);
      });

      table.on("columnTitleChanged", (col) =>
        updateCol(null, col, instanceRef, false)
      );

      table.on("cellEdited", (cell) => {
        cellEdited(cell);
      });

      table.on("cellDblClick", (e, cell) => {
        cell.edit(true);
      });

      table.on("cellEditCancelled", (cell) => {
        cell.getElement().blur();
      });

      table.on("cellEdited", (cell) => {
        cell.getElement().blur();
      });

      table.on("rowClick", async (cell) => {
        await setHeaderNonEditable(editingColumn, instanceRef);
      });

      table.on("headerClick", async (cell) => {
        await setHeaderNonEditable(editingColumn, instanceRef);
      });
    }
  }, [columns, editingColumn, rows]);

  // Function to handle adding a new column
  const handleAddColumn = () => {
    try {
      const newColumnSlug = `new_column_${columns.length + 1}`;

      const newColumn = {
        id: columns.length + 1,
        title: `New Column ${columns.length + 1}`,
        field: newColumnSlug,
        editor: "input",
        editable: false,
      };

      // Add new column to the table
      instanceRef.current.addColumn(
        setFormattedCol(newColumn, editingColumn, instanceRef),
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

      instanceRef.current.setData(updatedRows);

      setColumns((prevColumns) => [...prevColumns, newColumn]);
      setRows(updatedRows);
      saveNewColumn(newColumn);
    } catch (error) {
      console.error("Error adding new column:", error);
    }
  };

  // Function to remove selected rows
  const handleRemoveRows = () => {
    try {
      // Get remaining rows by excluding selected rows
      const updatedRows = rows.filter(
        (row) => !selectedRows.some((selected) => selected.id === row.id)
      );

      // Update table and state
      setRows(updatedRows);
      instanceRef.current.setData(updatedRows);
      setSelectedRows([]); // Clear selection
    } catch (error) {
      console.error("Error removing rows:", error);
    }
  };

  return {
    tableContainerRef,
    handleAddColumn,
    handleRemoveRows, // Expose remove function
    loading: !data,
    columns,
    rows,
    selectedRows, // Expose selected rows
  };
};

export default useTabulatorTable;
