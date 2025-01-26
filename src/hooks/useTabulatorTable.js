import { useEffect, useRef, useState } from "react";
import { TabulatorFull as Tabulator } from "tabulator-tables";
import "tabulator-tables/dist/css/tabulator.min.css";
import {
  ajaxResponse,
  ajaxURLGenerator,
  tableCallbacks,
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

      const table = new Tabulator(domEle, {
        ajaxURL: "https://customized-table-backend.vercel.app/rows",
        data: [],
        columns: [],

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

  return {
    tableContainerRef,
  };
};

export default useTabulatorTable;
