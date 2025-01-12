import React, { useEffect } from "react";
import CustomizeTable from "./CustomizeTable";
import axios from "axios";

function App() {
  const fetchData = async () => {
    const res = await axios("https://jsonplaceholder.typicode.com/users");
    return res.data;
  };

  useEffect(() => {
    fetchData();
  }, []);

  const columns = [
    {
      accessorKey: "id",
      cell: (info) => info.getValue(),
      id: "column-id",
      size: 150,
    },
    {
      accessorFn: (row) => row.name,
      cell: (info) => info.getValue(),
      header: () => <span>Name</span>,
      id: "column-name",
      size: 150,
    },
    {
      accessorKey: "username",
      header: () => "username",
      id: "column-username",
      size: 120,
    },
  ];

  return (
    <div data-testid="customize-table" className="container">
      <CustomizeTable fetchData={fetchData} columns={columns} />
    </div>
  );
}

export default App;
