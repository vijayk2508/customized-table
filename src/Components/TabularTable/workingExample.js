import "tabulator-tables/dist/css/tabulator.min.css"; //import Tabulator stylesheet

import Tabulator from "tabulator-tables/src/js/core/Tabulator";
import AjaxModule from "tabulator-tables/src/js/modules/Ajax/Ajax";
import PageModule from "tabulator-tables/src/js/modules/Page/Page";
import SortModule from "tabulator-tables/src/js/modules/Sort/Sort";

Tabulator.registerModule([AjaxModule, PageModule, SortModule]);

document.getElementById("app").innerHTML = `
<div id="example-table"></div>
`;

new Tabulator("#example-table", {
  // height: "311px",
  // ajaxURL: "https://jsonplaceholder.typicode.com/albums?_page=2&_limit=20",
  ajaxURL: "https://randomuser.me/api",
  columns: [
    { title: "Email", field: "email" },
    { title: "Cell", field: "cell" },
    { title: "Gender", field: "gender" },
    { title: "Phone", field: "phone" },
  ],
  pagination: true, //enable pagination
  paginationSize: 10,
  paginationMode: "remote", //enable remote pagination
  ajaxURLGenerator: function (url, config, params) {
    const { page, size } = params;
    return url + `?page=${page}&results=${size}`;
  },
  ajaxResponse: function (url, params, response) {
    // Must configure with server side
    let last_page = 10;
    return {
      data: response.results,
      last_page,
    };
  },
});

