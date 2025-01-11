import React, { useEffect } from "react";
import CustomizeTable from "./CustomizeTable";
import axios from "axios";

function App() {
  const fetchData = async () => {
     const res = await axios('https://jsonplaceholder.typicode.com/users')
     console.log(res.data);
     return []
     
  };

  useEffect(() => {
    fetchData();
  }, []);

  const columns = [
    {
      accessorKey: "firstName",
      cell: (info) => info.getValue(),
      id: "column-firstName",
      size: 150,
    },
    {
      accessorFn: (row) => row.lastName,
      cell: (info) => info.getValue(),
      header: () => <span>Last Name</span>,
      id: "column-lastName",
      size: 150,
    },
    {
      accessorKey: "age",
      header: () => "Age",
      id: "column-age",
      size: 120,
    },
    {
      accessorKey: "visits",
      header: () => <span>Visits</span>,
      id: "column-visits",
      size: 120,
    },
    {
      accessorKey: "status",
      header: "Status",
      id: "column-status",
      size: 150,
    },
    {
      accessorKey: "progress",
      header: "Profile Progress",
      id: "column-progress",
      size: 180,
    },
  ]

  return (
    <div data-testid="customize-table" className="container">
      <CustomizeTable fetchData={fetchData} columns={columns}/>
    </div>
  );
}

export default App;
