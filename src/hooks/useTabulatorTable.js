import { useEffect, useRef, useState } from "react";
import { TabulatorFull as Tabulator } from "tabulator-tables";
import "tabulator-tables/dist/css/tabulator.min.css";
import {
  cellEdited,
  getColumnMapping,
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
  console.log(instanceRef);

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
        columns: [],

        //layout
        renderHorizontal: "virtual",
        layout: "fitDataStretch",
        // responsiveLayout: "hide", // hide column if it will not fixed in table
        resizableColumns: false,
        layoutColumnsOnNewData: true,


        movableRows: true,
        movableColumns: true,
        
        //Pagination
        pagination: true,
        paginationMode: "remote",
        paginationAddRow: "table",
        paginationSize: 10,
        paginationSizeSelector: [5, 10, 50, 100],
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

        //filter
        filterMode: "remote",

        placeholder: "No Data Available",
        placeholderHeaderFilter: "No Matching Data",

        rowContextMenu: rowContextMenu,
        autoColumns: false,
        history: true,

        ajaxURLGenerator: (url, _config, params) => {
          console.log(params);
          const columnMap = getColumnMapping(instanceRef);
          const filterQuery =
            params?.filter
              ?.map(
                (filter) =>
                  `field.${columnMap[filter.field]}.value_like=${filter.value}`
              )
              ?.join("&") || "";

          let queryURL = `${url}?_page=${params.page}&_limit=${params.size}&_sort=id`;

          if (filterQuery) {
            queryURL += `&${filterQuery}`;
          }

          console.log(queryURL);

          return queryURL;
        },
        ajaxResponse: (_url, _params, response) => {
          const data = getTransformData({
            columns: columns,
            rows: response,
          });

          const rows =
            data.rows?.map?.(({ tableId, ...rest }, idx) => ({
              ...rest,
              index: idx + 1,
            })) || [];

          return {
            data: rows,
            last_page: 10,
          };
        },
        columnHeaderVertAlign: "middle",
        columnHeaderSortMulti: true,
      });

      table.on("tableBuilt", () => {
        instanceRef.current = table;

        const initialColumns = [...columns].map(
          (column) =>
            setFormattedCol(
              column,
              editingColumn,
              instanceRef,
              setColumns,
              setRows
            )
        );
        //.sort((a, b) => a.orderIndex - b.orderIndex);

        console.log(initialColumns);

        initialColumns.unshift(zerothCol(instanceRef));

        table.setColumns(initialColumns);
        table.setPageSize(10);
        table.setMaxPage(rows.totalPages);

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
        if (cell.getColumn().getDefinition().editor) {
          cell?.edit?.(true);
        }
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
