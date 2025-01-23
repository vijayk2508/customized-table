import { axiosInstance } from ".";

function transformData(data) {
  // Initialize the new structure
  let transformedData = {
    id: data.id,
    name: data.name,
    columns: data.columns,
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
    transformedData.rows.push(transformedRow);
  });

  return transformedData;
}

export const getTableData = async function (id = 1) {
  const tableResponse = await axiosInstance.get(`/tables/${id}`);
  const tableData = tableResponse.data;

  const columnsResponse = await axiosInstance.get(
    `/columns?tableId=${tableData?.id}`
  );
  const columnData = columnsResponse.data;

  const rowResponse = await axiosInstance.get(`/rows?tableId=${tableData?.id}`);
  const rowData = rowResponse.data;

  let response = transformData({
    ...tableData,
    columns: columnData,
    rows: rowData,
  });
  return response;
};

export const saveNewColumn = async (newColumn) => {
  try {
    // Save the new column to the columns endpoint
    await axiosInstance.post('/columns', newColumn);
  } catch (error) {
    console.error('Error saving new column:', error);
  }
};