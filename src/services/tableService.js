import { axiosInstance } from ".";
// import data from "data/table.json"

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

// export const getTableData = async function (page = 1, pageSize = 10)
//   // const tableResponse = await axiosInstance.get(`/tables/${id}`);
//   // const tableData = tableResponse.data;

//   // const columnsResponse = await axiosInstance.get(
//   //   `/columns?tableId=${tableData?.id}`
//   // );
//   // const columnData = columnsResponse.data;

//   // const rowResponse = await axiosInstance.get(`/rows?tableId=${tableData?.id}`);
//   // const rowData = rowResponse.data;

//   const response = await fetch("/data/table.json");
//   const data = await response.json();

//   const tableData = data.tables.find((tab) => tab.id === "1");
//   const rowData = data.rows.filter((row) => row.tableId === 1);
//   const columnData = data.columns.filter((col) => col.tableId === 1);

//   // Calculate pagination indices
//   const skip = (page - 1) * pageSize;
//   const limit = pageSize;
//   const paginatedRows = rowData.slice(skip, skip + limit);

//   // Calculate total pages
//   const totalPages = Math.ceil(rowData.length / pageSize);

//   let transformedResponse = transformData({
//     ...tableData,
//     columns: columnData,
//     rows: paginatedRows,
//   });

//   return {
//     data: transformedResponse,
//     total: rowData.length,
//     fetchRecords: paginatedRows.length,
//     skip: skip,
//     limit: limit,
//     totalPages: totalPages
//   };
// };


export const getTableData = async function (page = 1, pageSize = 10) {
  const response = await fetch("/data/table.json");
  const data = await response.json();

  const tableData = data.tables.find((tab) => tab.id === 1);
  const rowData = data.rows.filter((row) => row.tableId === 1);
  const columnData = data.columns.filter((col) => col.tableId === 1);

  // Calculate pagination indices
  const skip = (page - 1) * pageSize;
  const limit = pageSize;
  const paginatedRows = rowData.slice(skip, skip + limit);

  // Calculate total pages
  const totalPages = Math.ceil(rowData.length / pageSize);

  let transformedResponse = transformData({
    ...tableData,
    columns: columnData,
    rows : paginatedRows
  });
  
  transformedResponse.rows= {
    data: transformedResponse.rows,
    total: rowData.length,
    skip: skip,
    limit: limit,
    totalPages: totalPages
  }
  
  return transformedResponse
};

export const saveNewColumn = async (newColumn) => {
  try {
    // Save the new column to the columns endpoint
    await axiosInstance.post("/columns", newColumn);
  } catch (error) {
    console.error("Error saving new column:", error);
  }
};

export const deleteColumn = async (colId) => {
  try {
    // Save the new column to the columns endpoint
    await axiosInstance.delete(`/columns/${colId}`);
  } catch (error) {
    console.error("Error saving new column:", error);
  }
};
