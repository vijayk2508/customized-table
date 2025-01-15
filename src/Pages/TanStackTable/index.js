import React, { use, useEffect } from "react";
import CustomizeTable from "./CustomizeTable";
import axios from "axios";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

function TanStackTable() {
  const fetchData = async () => {
    const res = await axios("https://jsonplaceholder.typicode.com/users");
    return res.data;
  };

  useEffect(()=>{
    console.log("useEffect 13");
  })

  useEffect(() => {
    console.log("useEffect 17");
    
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

  const queryClient = new QueryClient();

  return (
    <div data-testid="customize-table" className="container">
      <QueryClientProvider client={queryClient}>
        <CustomizeTable fetchData={fetchData} columns={columns} />
      </QueryClientProvider>
    </div>
  );
}

export default TanStackTable;
