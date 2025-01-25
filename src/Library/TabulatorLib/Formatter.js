import { Chart, registerables } from "chart.js";
import { BoxPlotController, BoxAndWiskers } from '@sgratzl/chartjs-chart-boxplot';


// Register all necessary Chart.js components and the box plot plugin
Chart.register(...registerables, BoxPlotController, BoxAndWiskers);

// Line Chart Formatter
const lineFormatter = function (cell) {
  const data = cell.getValue();

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  new Chart(ctx, {
    type: "line",
    data: {
      labels: data.map((_, index) => index),
      datasets: [
        {
          data: data,
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 2,
          tension: 0.3,
          pointRadius: 0,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
      },
      scales: {
        x: { display: false },
        y: { display: false },
      },
      layout: { padding: 5 },
    },
  });

  canvas.style.height = "40px";
  canvas.style.width = "100%";

  return canvas;
};

// Bar Chart Formatter
const barFormatter = function (cell) {
  const data = cell.getValue();

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: data.map((_, index) => index),
      datasets: [
        {
          data: data,
          backgroundColor: "rgba(75, 192, 192, 0.5)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
      },
      scales: {
        x: { display: false },
        y: { display: false },
      },
      layout: { padding: 5 },
    },
  });

  canvas.style.height = "40px";
  canvas.style.width = "100%";

  return canvas;
};

// Tristate Chart Formatter
const tristateFormatter = function (cell) {
  const data = cell.getValue();

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: data.map((_, index) => index),
      datasets: [
        {
          data: data,
          backgroundColor: data.map((value) =>
            value > 0
              ? "rgba(75, 192, 75, 0.8)" // Green for positive values
              : value < 0
              ? "rgba(192, 75, 75, 0.8)" // Red for negative values
              : "rgba(192, 192, 192, 0.8)" // Gray for zero
          ),
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
      },
      scales: {
        x: { display: false },
        y: { display: false },
      },
      layout: { padding: 5 },
    },
  });

  canvas.style.height = "40px";
  canvas.style.width = "100%";

  return canvas;
};

// Box Plot Formatter
const boxFormatter = function (cell) {
  const data = cell.getValue();

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  new Chart(ctx, {
    type: "boxplot", // Requires `chartjs-chart-box-and-violin-plot` package
    data: {
      labels: ["Box"],
      datasets: [
        {
          label: "Box Plot",
          data: [data], // Data should be in a format like [min, q1, median, q3, max]
          borderColor: "rgba(75, 192, 192, 1)",
          backgroundColor: "rgba(75, 192, 192, 0.3)",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
      },
      scales: {
        x: { display: false },
        y: { display: false },
      },
      layout: { padding: 5 },
    },
  });

  canvas.style.height = "40px";
  canvas.style.width = "100%";

  return canvas;
};

function progress(){
  return "progress"
}

function star(){
  return "star"
}

function tickCross(){
  return "tickCross"
}

const Formatter = {
  lineFormatter,
  barFormatter,
  tristateFormatter,
  boxFormatter,
  progress : progress(),
  star : star(),
  tickCross : tickCross()
};

export default Formatter;
