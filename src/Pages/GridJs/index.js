import React, { useEffect, useRef } from "react";
import Layout from "../../Layout";
import { TabulatorFull as Tabulator } from "tabulator-tables";
import "tabulator-tables/dist/css/tabulator.min.css";

export const tabledata = [
  {
    id: 1,
    name: "Oli Bob",
    progress: 12,
    gender: "male",
    rating: 1,
    col: "red",
    dob: "19/02/1984",
    car: true, 
    lucky_no: 5,
  },
  {
    id: 2,
    name: "Mary May",
    progress: 1,
    gender: "female",
    rating: 2,
    col: "blue",
    dob: "14/05/1982",
    car: true, 
    lucky_no: 10,
  },
  {
    id: 3,
    name: "Christine Lobowski",
    progress: 42,
    gender: "female",
    rating: 0,
    col: "green",
    dob: "22/05/1982",
    car: true, 
    lucky_no: 12,
  },
  {
    id: 4,
    name: "Brendon Philips",
    progress: 100,
    gender: "male",
    rating: 1,
    col: "orange",
    dob: "01/08/1980",
    lucky_no: 18,
  },
  {
    id: 5,
    name: "Margret Marmajuke",
    progress: 16,
    gender: "female",
    rating: 5,
    col: "yellow",
    dob: "31/01/1999",
    lucky_no: 33,
  },
  {
    id: 6,
    name: "Frank Harbours",
    progress: 38,
    gender: "male",
    rating: 4,
    col: "red",
    dob: "12/05/1966",
    car: true, 
    lucky_no: 2,
  },
  {
    id: 7,
    name: "Jamie Newhart",
    progress: 23,
    gender: "male",
    rating: 3,
    col: "green",
    dob: "14/05/1985",
    car: true, 
    lucky_no: 63,
  },
  {
    id: 8,
    name: "Gemma Jane",
    progress: 60,
    gender: "female",
    rating: 0,
    col: "red",
    dob: "22/05/1982",
    car: true, 
    lucky_no: 72,
  },
  {
    id: 9,
    name: "Emily Sykes",
    progress: 42,
    gender: "female",
    rating: 1,
    col: "maroon",
    dob: "11/11/1970",
    lucky_no: 44,
  },
  {
    id: 10,
    name: "James Newman",
    progress: 73,
    gender: "male",
    rating: 5,
    col: "red",
    dob: "22/03/1998",
    lucky_no: 9,
  },
  {
    id: 11,
    name: "Martin Barryman",
    progress: 20,
    gender: "male",
    rating: 5,
    col: "violet",
    dob: "04/04/2001",
  },
  {
    id: 12,
    name: "Jenny Green",
    progress: 56,
    gender: "female",
    rating: 4,
    col: "indigo",
    dob: "12/11/1998",
    car: true, 
  },
  {
    id: 13,
    name: "Alan Francis",
    progress: 90,
    gender: "male",
    rating: 3,
    col: "blue",
    dob: "07/08/1972",
    car: true, 
  },
  {
    id: 14,
    name: "John Phillips",
    progress: 80,
    gender: "male",
    rating: 1,
    col: "green",
    dob: "24/09/1950",
    car: true, 
  },
  {
    id: 15,
    name: "Ed White",
    progress: 70,
    gender: "male",
    rating: 0,
    col: "yellow",
    dob: "19/06/1976",
  },
  {
    id: 16,
    name: "Paul Branderson",
    progress: 60,
    gender: "male",
    rating: 5,
    col: "orange",
    dob: "01/01/1982",
  },
  {
    id: 18,
    name: "Emma Netwon",
    progress: 40,
    gender: "female",
    rating: 4,
    col: "brown",
    dob: "07/10/1963",
    car: true, 
  },
  {
    id: 19,
    name: "Hannah Farnsworth",
    progress: 30,
    gender: "female",
    rating: 1,
    col: "pink",
    dob: "11/02/1991",
    car: false, 
  },
  {
    id: 20,
    name: "Victoria Bath",
    progress: 20,
    gender: "female",
    rating: 2,
    col: "purple",
    dob: "22/03/1986",
    car: false, 
  },
];

function GridJs() {
  const tableRef = useRef(null);

  useEffect(() => {
    // Initialize Tabulator when the component is mounted
    tableRef.current = new Tabulator("#example-table", {
      editTriggerEvent: "dblclick",
      layout: "fitColumns",
      tooltips: true,
      addRowPos: "top",
      history: true,
      pagination: "local",
      paginationSize: 7,
      movableColumns: true,
      resizableRows: true,
      data: tabledata,
      initialSort: [{ column: "name", dir: "asc" }],
      columns: [
        { title: "Name", field: "name", editor: "input" },
        {
          title: "Task Progress",
          field: "progress",
          align: "left",
          formatter: "progress",
          editor: true,
        },
        {
          title: "Gender",
          field: "gender",
          width: 90,
          editor: "select",
          editorParams: { Male: "male", Female: "female" },
        },
        {
          title: "Rating",
          field: "rating",
          formatter: "star",
          align: "center",
          width: 100,
          editor: true,
        },
        { title: "Color", field: "col", width: 130, editor: "input" },
        {
          title: "Date Of Birth",
          field: "dob",
          width: 130,
          sorter: "date",
          align: "center",
        },
        {
          title: "Car",
          field: "car",
          width: 100,
          align: "center",
          formatter: function (cell) {
            return cell.getValue()
              ? "<input type='checkbox' checked />"
              : "<input type='checkbox' />";
          },
          cellClick: function (e, cell) {
            const value = cell.getValue();
            cell.setValue(!value);
          },
          headerFilter: "tickCross",
          headerFilterParams: {
            tristate: true,
          },
        },
      ],
      selectable: true,
      selectableRangeMode: "click",
      selectableRange: true,
      selectableRangeColumns: true,
      selectableRangeRows: true,
      selectableRangeClearCells: true,
    });
  }, []); // Empty dependency array ensures this runs only once

  return (
    <Layout>
      <div id="example-table"></div>
    </Layout>
  );
}

export default GridJs;
