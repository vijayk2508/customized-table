import { axiosInstance } from "../../services";
import { saveNewColumn } from "../../services/tableService";

const handleAddColumn = (column, editingColumn, instanceRef, left = false) => {
  try {
    const columns = instanceRef.current.getColumns();
    const colIndex = columns.findIndex(
      (col) => col.getField() === column.getField()
    );

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
      left,
      (!left
        ? columns[colIndex + 1]?.getField()
        : columns[colIndex]?.getField()) || null
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

    saveNewColumn(newColumn);
  } catch (error) {
    console.error("Error adding new column:", error);
  }
};

export const setColHeaderMenu = (instanceRef, editingColumn) => {
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
          headerMenu: headerMenu(instanceRef, editingColumn),
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

export const zerothColContextMenu = function (instanceRef) {
  const selectedRows = instanceRef.current.getSelectedRows();
  const menu = [];

  menu.push(
    {
      label: "Add Row Above",
      action: function (_e, cell) {
        const table = instanceRef.current;
        const newRow = {}; // Define the structure of the new row
        const row = cell.getRow();
        table.addRow(newRow, row, "before"); // Add the new row above the selected row
      },
    },
    {
      label: "Add Row Below",
      action: function (_e, cell) {
        const table = instanceRef.current;
        const newRow = {}; // Define the structure of the new row
        const row = cell.getRow();
        table.addRow(newRow, row, "after"); // Add the new row below the selected row
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
export const headerMenu = (instanceRef, editingColumn) => [
  {
    label: "Add Column Right Side",
    action: (e, col) => handleAddColumn(col, editingColumn, instanceRef),
  },
  {
    label: "Add Column Left Side",
    action: (e, col) => handleAddColumn(col, editingColumn, instanceRef, true),
  },
  {
    label: "Delete Column",
    action: function (e, column) {
      column.delete();
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
