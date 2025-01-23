import { axiosInstance } from "../../services";

export const setColHeaderMenu = (instanceRef) => {
  const updatedColumns = instanceRef.current.getColumns().map((col) => {
    const colDef = col.getDefinition();
    return colDef.id === 0
      ? {
          ...colDef,
          headerMenu: zerothCol(instanceRef).headerMenu,
          contextMenu: [
            {
              label: "Delete Selected Rows",
              action: function (_e, _column) {
                const selectedRows = instanceRef.current.getSelectedRows();
                const rowIds = selectedRows.map((row) => row.getData().id);
                instanceRef.current.deleteRow(rowIds);
              },
            },
          ],
        }
      : {
          ...colDef,
          headerMenu: headerMenu(instanceRef),
        };
  });

  instanceRef.current.setColumns(updatedColumns);
};

export const zerothCol = (instanceRef) => {
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

// Function to get the submenu for hiding specific columns
const getHideColumnSubMenu = (instanceRef) => {
  const table = instanceRef?.current;

  const menu = [];
  const columns = table.getColumns();

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
export const headerMenu = (instanceRef) => [
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
    },
  },
];

export const cellContextMenu = [
  {
    label: "Reset Value",
    action: function (e, cell) {
      cell.setValue("");
    },
  },
];

export const updateCol = async function (
  _e,
  column,
  instanceRef,
  editableTitle = true
) {
  try {
    const currCol = column?.getDefinition?.();

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
    await axiosInstance.put(`/rows/${rowData.id}`, formattedRowData);
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
  return {
    ...column,
    editor: "input",
    headerFilter: false, // add header filter to every column
    headerSort: false,
    editableTitle: false,
    headerDblClick: (e, column) => {
      editingColumn.current = column;
      updateCol(e, column, instanceRef);
    },
    contextMenu: cellContextMenu,
  };
};
