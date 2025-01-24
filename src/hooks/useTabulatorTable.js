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
import { getTransformData } from "../services/tableService";

const useTabulatorTable = (columnData) => {
  const tableContainerRef = useRef();
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const editingColumn = useRef(null);
  const instanceRef = useRef();

  useEffect(() => {
    if (columnData) {
      setColumns(columnData);
    }
  }, [columnData]);

  useEffect(() => {
    if (!instanceRef.current && tableContainerRef.current) {
      const domEle = tableContainerRef.current;

      const table = new Tabulator(domEle, {
        ajaxURL: "https://customized-table-backend.vercel.app/rows",
        data: [],
        //columns: columnData,
        layout: "fitDataStretch",
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
        history: true,
        initialSort: [{ column: "name", dir: "asc" }],
        paginationCounter: function (
          pageSize,
          currentRow,
          currentPage,
          _totalRows,
          totalPages
        ) {
          return `Showing ${currentPage} to ${
            currentRow + pageSize - 1
          } of ${totalPages} rows`;
        },

        ajaxURLGenerator : (url, _config, params) => {
          return `${url}?_page=${params.page}&_per_page=${params.size}`;
        },
        ajaxResponse: (_url, _params, response) => {
          return {
            data: getTransformData({
              columns: columns,
              rows: response,
            }).rows,
            last_page: 10,
          };
        },
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
