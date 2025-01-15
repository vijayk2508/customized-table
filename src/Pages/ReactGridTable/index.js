import axios from "axios";
import React from "react";

function ReactGridTable() {
  const fetchData = async () => {
    const res = await axios("https://jsonplaceholder.typicode.com/users");
    return res.data;
  };

  return <div>ReactGridTable</div>;
}

export default ReactGridTable;
