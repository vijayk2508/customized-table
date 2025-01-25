import { axiosInstance } from ".";
// import data from "data/table.json"

export function getTransformData(data) {
  // Initialize the new structure
  let updateData = {
    id: data?.id ?? "Table",
    name: data?.name ?? "Table",
    columns: data?.columns || [],
    rows: [],
  };

  // Iterate through the rowData and transform it
  data.rows.forEach((row) => {
    let transformedRow = { id: row.id, tableId: row.tableId };

    // Iterate through the columns and map the corresponding field values from rowData
    data.columns.forEach((column) => {
      transformedRow[column.field] = row?.field?.[column?.id]?.value || "";
    });

    // Push the transformed row into the rows array
    updateData.rows.push(transformedRow);
  });

  return updateData;
}

export const getTableColumnData = async function (page = 1, pageSize = 10) {
  const columnsResponse = await axiosInstance.get(`/columns?tableId=1`);
  const columnData = columnsResponse.data;
  return columnData;
};

export const saveNewColumn = async (newColumn) => {
  try {
    // Save the new column to the columns endpoint
    //await axiosInstance.post("/columns", newColumn);
  } catch (error) {
    console.error("Error saving new column:", error);
  }
};

export const deleteColumn = async (colId) => {
  try {
    // Save the new column to the columns endpoint
    //await axiosInstance.delete(`/columns/${colId}`);
  } catch (error) {
    console.error("Error saving new column:", error);
  }
};
