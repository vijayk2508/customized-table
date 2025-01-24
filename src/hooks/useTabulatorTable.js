import { useEffect, useRef, useState } from "react";
import { TabulatorFull as Tabulator } from "tabulator-tables";
import "tabulator-tables/dist/css/tabulator.min.css";
import {
  cellEdited,
  rowContextMenu,
  setColHeaderMenu,
  setFormattedCol,
  setHeaderNonEditable,
  updateCol,
  zerothCol,
} from "../Library/TabulatorLib/TabulatorHelper";

const useTabulatorTable = (data) => {
  const tableContainerRef = useRef();
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
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
        pagination: true,
        paginationMode: "remote",
        paginationAddRow: "table",
        paginationSize: 10,
        paginationSizeSelector: [5, 10, 50, 100],
        responsiveLayout: "hide",
        resizableColumns: false,
        layoutColumnsOnNewData: true,
        placeholderEmpty: "Empty",
        rowContextMenu: rowContextMenu,
        autoColumns: false,
      });

      table.on("tableBuilt", () => {
        instanceRef.current = table;

        const initialColumns = columns
          .map((column) =>
            setFormattedCol(
              column,
              editingColumn,
              instanceRef,
              setColumns,
              setRows
            )
          )
          .sort((a, b) => a.orderIndex - b.orderIndex);

        initialColumns.unshift(zerothCol(instanceRef));

        table.setColumns(initialColumns);
        table.setPageSize(10);
        table.setMaxPage(rows.totalPages);
        table.setPage(1);
        table.setData(rows.data);

        setColHeaderMenu({ instanceRef, editingColumn, setColumns, setRows });
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
        cell?.getElement?.()?.blur?.();
      });

      table.on("cellEdited", (cell) => {
        cell?.getElement?.()?.blur?.();
      });

      table.on("rowClick", async (cell) => {
        await setHeaderNonEditable(editingColumn, instanceRef);
      });

      table.on("headerClick", async (cell) => {
        await setHeaderNonEditable(editingColumn, instanceRef);
      });
    }
  }, [columns, editingColumn, rows]);

  return {
    tableContainerRef,
  };
};

export default useTabulatorTable;
