import { useEffect, useRef, useState } from "react";
import { TabulatorFull as Tabulator } from "tabulator-tables";
import "tabulator-tables/dist/css/tabulator.min.css";
import {
  ajaxResponse,
  ajaxURLGenerator,
  setFormattedCol,
  tableCallbacks,
  zerothCol,
} from "../Library/TabulatorLib/TabulatorHelper";

const useTabulatorTable = (columnData) => {
  const tableContainerRef = useRef();
  const [columns, setColumns] = useState([]);
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

      const initialColumns = [...columns].map((column) =>
        setFormattedCol(column, editingColumn, instanceRef)
      );

      initialColumns.unshift(zerothCol(instanceRef));

      const table = new Tabulator(domEle, {
        ajaxURL: "https://customized-table-backend.vercel.app/rows",
        data: [],
        columns: initialColumns,

        printAsHtml: true,
        printHeader: "<h1>Example Table Header<h1>",
        printFooter: "<h2>Example Table Footer<h2>",

        editTriggerEvent: "dblclick",

        height: "431px",

        selectableRange: 1,
        selectableRangeColumns: true,
        selectableRangeRows: true,
        selectableRangeClearCells: true,

        clipboard: true,
        clipboardCopyStyled: true,
        columnDefaults: {
          headerSort: false,
          resizable: "header",
        },
        clipboardCopyRowRange: "range",
        clipboardPasteParser: "range",
        clipboardPasteAction: "range",

        persistenceMode: "local",

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

        //sorting
        sortMode: "remote",

        placeholder: "No Data Available",
        placeholderHeaderFilter: "No Matching Data",
        autoColumns: false,
        history: true,

        columnHeaderVertAlign: "middle",
        columnHeaderSortMulti: true,

        ajaxURLGenerator: (url, _config, params) =>
          ajaxURLGenerator(url, _config, params, instanceRef),
        ajaxResponse: (_url, _params, response) =>
          ajaxResponse(_url, _params, response, columns),
      });

      tableCallbacks({
        table,
        instanceRef,
        columns,
        editingColumn,
        setColumns,
      });
    }
  }, [columns, editingColumn]);

  const handleDownload = (format, fileName, options = {}) => {
    try {
      const table = Tabulator.findTable(tableContainerRef.current)[0];
      if (table) {
        table.download(format, fileName, options);
      }
    } catch (error) {}
  };

  const handlePrint = (e) => {
    e.preventDefault();
    if (instanceRef.current) {
      instanceRef.current.print(false, true);
    }
  };

  return {
    tableContainerRef,
    handleDownload,
    handlePrint,
  };
};

export default useTabulatorTable;
