import { deleteColumn, getTransformData } from "../../services/tableService";
import { cellContextMenu } from "./cellContextMenu";
import FieldFormatter from "./fieldFormatter";

export const rowContextMenu = [
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
];

const handleAddColumn = ({
  column,
  editingColumn,
  instanceRef,
  left = false,
}) => {
  try {
    document.dispatchEvent(new MouseEvent("click"));

    const columns = instanceRef.current.getColumns();
    const colIndex = columns.findIndex(
      (col) => col.getField() === column.getField()
    );

    const newColumnSlug = `new_column_${columns.length + 1}`;

    const newColumn = {
      id: String(columns.length + 1),
      title: `New Column ${columns.length + 1}`,
      field: newColumnSlug,
      editor: "input",
      editable: false,
    };

    instanceRef.current.addColumn(
      setFormattedCol(newColumn, editingColumn, instanceRef),
      left,
      columns[colIndex]?.getField() || null
    );
  } catch (error) {
    console.error("Error adding new column:", error);
  } finally {
    instanceRef.current.redraw(true);
  }
};

export const setColHeaderMenu = ({ instanceRef, editingColumn }) => {
  const updatedColumns = instanceRef.current.getColumns().map((col) => {
    const colDef = col.getDefinition();
    return colDef.id === 0
      ? {
          ...colDef,
          headerMenu: zerothCol(instanceRef, editingColumn).headerMenu,
          contextMenu: () => zerothColContextMenu(instanceRef, editingColumn),
        }
      : {
          ...colDef,
          headerMenu: headerMenu({
            instanceRef,
            editingColumn,
          }),
        };
  });

  instanceRef.current.setColumns(updatedColumns);
};

export const zerothCol = (instanceRef, _editingColumn) => {
  const colData = {
    id: 0,
    title: "",
    field: "index",
    formatter: "rownum",
    tableId: "",
    headerSort: false,
    editableTitle: false,
    movable: false,
    resizable: false,
    width: 10,
    hozAlign: "center",
    frozen: true,
    cellClick: (e, cell) => {
      const row = cell.getRow();
      row.toggleSelect();
    },

    headerMenu: [
      {
        label: "Show Column",
        menu: getHideColumnSubMenu(instanceRef),
      },
    ],
  };

  return colData;
};

export const zerothColContextMenu = function (instanceRef, _editingColumn) {
  const selectedRows = instanceRef.current.getSelectedRows();
  const menu = [];
  menu.push(
    {
      label: "Add Row Above",
      action: function (_e, cell) {
        const table = instanceRef.current; // Reference to the Tabulator table instance
        const newRow = {}; // Define the structure of the new row (e.g., default values)
        const row = cell.getRow(); // Get the selected row
        const rowIndex = row.getIndex(); // Get the index of the selected row

        // Add the new row above the selected row
        table.addRow(newRow, true, rowIndex); // 'true' adds the row before the specified index
      },
    },
    {
      label: "Add Row Below",
      action: function (_e, cell) {
        const table = instanceRef.current; // Reference to the Tabulator table instance
        const newRow = {}; // Define the structure of the new row (e.g., default values)
        const row = cell.getRow(); // Get the selected row
        const rowIndex = row.getIndex(); // Get the index of the selected row

        // Add the new row below the selected row
        table.addRow(newRow, false, rowIndex); // 'false' adds the row after the specified index
      },
    }
  );

  menu.push(
    selectedRows.length > 1
      ? {
          label: "Delete Selected Rows",
          action: function (_e, _column) {
            const rowIds = selectedRows.map((row) => row.getData().id);
            instanceRef.current.deleteRow(rowIds);
          },
        }
      : {
          label: "Delete Row",
          action: function (_e, cell) {
            const row = cell.getRow();
            row.delete();
          },
        }
  );

  return menu;
};

// Function to get the submenu for hiding specific columns
const getHideColumnSubMenu = (instanceRef) => {
  const table = instanceRef?.current;

  const menu = [];
  const columns = table?.getColumns?.();
  if (!columns) return;
  for (let column of columns) {
    if (column.getDefinition().id === 0) continue;
    //create checkbox element
    let checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = column.isVisible();
    checkbox.setAttribute("data-field", column.getField());

    //build label
    let label = document.createElement("span");
    let title = document.createElement("span");

    title.textContent = " " + column.getDefinition().title;

    label.appendChild(checkbox);
    label.appendChild(title);

    //create menu item
    menu.push({
      label: label,
      action: function (e) {
        //prevent menu closing
        e.stopPropagation();

        //toggle current column visibility
        const field = checkbox.getAttribute("data-field");
        const targetCol = instanceRef.current.getColumn(field);
        if (checkbox.checked) {
          targetCol.show();
        } else {
          targetCol.hide();
        }

        //update checkbox state
        checkbox.checked = targetCol.isVisible();
      },
    });
  }

  return menu;
};

//define row context menu
export const headerMenu = ({ instanceRef, editingColumn }) => [
  {
    label: "Add Column Right Side",
    action: (e, column) =>
      handleAddColumn({
        column,
        editingColumn,
        instanceRef,
        left: false,
      }),
  },
  {
    label: "Add Column Left Side",
    action: (e, column) =>
      handleAddColumn({
        column,
        editingColumn,
        instanceRef,
        left: true,
      }),
  },
  {
    label: "Delete Column",
    action: async function (e, column) {
      column.delete();
      await deleteColumn(column.getDefinition().id);
      setColHeaderMenu({ instanceRef, editingColumn }); // Update the header menu
    },
  },
  {
    label: "Sort By Asc",
    action: function (e, column) {
      column.getTable().setSort(column.getField(), "asc");
    },
  },
  {
    label: "Sort By Dsc",
    action: function (e, column) {
      column.getTable().setSort(column.getField(), "desc");
    },
  },
  {
    label: "Hide Column",
    action: function (e, column) {
      column.hide();
      setColHeaderMenu({ instanceRef, editingColumn }); // Update the header menu
    },
  },
];

export const updateCol = async function (
  _e,
  { column, instanceRef, editableTitle = true }
) {
  try {
    const currCol = column?.getDefinition?.();

    if (currCol) {
      await instanceRef.current.updateColumnDefinition(currCol.field, {
        editableTitle,
      });

      if (currCol.id && !editableTitle) {
        //await axiosInstance.put(`/columns/${currCol.id}`, currCol);
      }
    }
  } catch (error) {
    console.log(error);
  }
};

export const cellEdited = async function (cell) {
  const columnData = cell.getColumn().getDefinition();
  const rowData = cell.getRow().getData();
  const newValue = cell.getValue(); // Get the new value of the edited cell

  // Format the rowData to match the expected structure
  const formattedRowData = {
    id: rowData.id,
    field: {}, // Initialize an empty field object
    tableId: rowData.tableId,
  };

  // Get the column layout to map fields to column IDs
  const columnLayout = cell.getTable().getColumnLayout();
  const columnMapping = columnLayout.reduce((acc, curr) => {
    acc[curr.field] = curr.id; // Map field names to their corresponding column IDs
    return acc;
  }, {});

  // Populate the `field` object using column IDs
  for (const key in rowData) {
    if (key !== "id" && key !== "tableId" && columnMapping[key]) {
      formattedRowData.field[columnMapping[key]] = {
        value: rowData[key],
      };
    }
  }

  // Update the specific field with the new value
  if (columnMapping[columnData.field]) {
    formattedRowData.field[columnMapping[columnData.field]] = {
      value: newValue,
    };
  }

  try {
    //await axiosInstance.put(`/rows/${rowData.id}`, formattedRowData);
    console.log("Row updated successfully:", formattedRowData);
  } catch (error) {
    console.error("Error updating data:", error);

    // Optional: Revert the cell value to its original state
    cell.setValue(rowData[columnData.field], true); // Suppress triggering another update
  }
};

export const setHeaderNonEditable = async function (
  editingColumn,
  instanceRef
) {
  if (!instanceRef.current || !editingColumn.current) return;

  const field = editingColumn.current?.getDefinition?.()?.field || "";
  if (field) {
    await instanceRef?.current?.updateColumnDefinition?.(field, {
      editableTitle: false,
    });
    editingColumn.current = null;
  }
};

export const setFormattedCol = (column, editingColumn, instanceRef) => {
  const currColumn = JSON.parse(JSON.stringify(column));
  let options = {
    ...currColumn,
    editable: true,
    headerSort: false,
    editableTitle: false,
    contextMenu: cellContextMenu,
    headerMenu: headerMenu({ instanceRef, editingColumn }),
    clipboard: true,
  };

  if (currColumn?.editor) {
    options.headerDblClick = (e, column) => {
      editingColumn.current = column;
      updateCol(e, { column, instanceRef });
    };
  }

  if (
    [
      "star",
      "lineFormatter",
      "barFormatter",
      "tristateFormatter",
      "boxFormatter",
    ].includes(currColumn?.formatter)
  ) {
    options.headerFilter = false;
  } else {
    options.headerFilter = true;
  }

  if (
    [
      //"age",
      //"email",
      //"phone",
      "address",
      "city",
      "country",
      "occupation",
      "rating",
      "dob",
      //"line",
      //"col",
      // "bar",
      // "tristate",
      // "box",
    ].includes(String(currColumn?.field)?.toLowerCase())
  ) {
    options.visible = false;
  }

  if (
    FieldFormatter?.[column?.formatter] &&
    typeof column?.formatter === "string"
  ) {
    options.formatter = FieldFormatter?.[column?.formatter];
  }

  if (["age"].includes(String(currColumn?.field)?.toLowerCase())) {
    // Additional logic for specific fields
    options.formatter = (cell) => {
      const cellElement = cell.getElement();
      cellElement.style.textAlign = "center";
      cellElement.style.color = "red";
      return cell.getValue();
    };
  }

  if (["id"].includes(String(currColumn?.field)?.toLowerCase())) {
    options = {
      ...options,
      headerFilter: "list",
      headerFilterParams: {
        values: [1, 2, 3, 100],
        multiselect: true,
      },
    };
  }

  if (["tickCross"].includes(options.formatter)) {
    options["formatter"] = function (cell) {
      const cellElement = cell.getElement();
      cellElement.style.textAlign = "center";
      return cell.getValue()
        ? "<input type='checkbox' checked />"
        : "<input type='checkbox' />";
    };
    options["cellClick"] = function (e, cell) {
      const value = cell.getValue();
      cell.setValue(!value);
    };
    options["headerFilter"] = "tickCross";
    options["headerFilterParams"] = {
      tristate: false,
    };
  }

  return options;
};

export const getColumnMapping = (instanceRef) => {
  if (!instanceRef.current) return;
  const columnLayout = instanceRef.current?.getColumnDefinitions();
  const columnMapping = columnLayout.reduce((acc, curr) => {
    acc[curr.field] = curr.id; // Map field names to their corresponding column IDs
    return acc;
  }, {});

  return columnMapping;
};

export const ajaxURLGenerator = (url, _config, params, instanceRef) => {
  console.log(params);

  const columnMap = getColumnMapping(instanceRef);

  // Generate the filter query
  const filterQuery =
    params?.filter
      ?.map(
        (filter) =>
          `field.${columnMap[filter.field]}.value_like=${filter.value}`
      )
      ?.join("&") || "";

  // Generate the sort query and order
  const sortQuery =
    params?.sort?.length > 0
      ? params.sort
          .map((sort) => `field.${columnMap[sort.field]}.value`)
          .join(",")
      : "id"; // Default sort by 'id'

  const sortOrder =
    params?.sort?.length > 0
      ? params.sort.map((sort) => `${sort.direction || "asc"}`).join(",")
      : "asc"; // Default order 'asc'

  // Construct the base query URL
  let queryURL = `${url}?_page=${params.page}&_limit=${params.size}`;

  // Append the filter query
  if (filterQuery) {
    queryURL += `&${filterQuery}`;
  }

  // Append the sort query
  queryURL += `&_sort=${sortQuery}&_order=${sortOrder}`;

  console.log(queryURL);

  return queryURL;
};

export const ajaxResponse = (_url, _params, response, columns) => {
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
    last_page: 30,
  };
};

export const tableCallbacks = ({ table, instanceRef, editingColumn }) => {
  table.on("tableBuilt", () => {
    instanceRef.current = table;
    table.setPageSize(10);

    setColHeaderMenu({ instanceRef, editingColumn });
  });

  table.on("rowSelectionChanged", function () {
    console.log(arguments);
  });

  table.on("rowClick", async (cell) => {
    await setHeaderNonEditable(editingColumn, instanceRef);
  });

  table.on("headerClick", async (cell) => {
    await setHeaderNonEditable(editingColumn, instanceRef);
  });
};
