"use strict";
import zoomPlugin from "chartjs-plugin-zoom";
import Chart from "chart.js/auto";
Chart.register(zoomPlugin);

const chartSelector__1 = document.getElementById("chart__1").getContext("2d");
const chartSelector__2 = document.getElementById("chart__2").getContext("2d");
let chart__1;
let chart__2;

const chartConfig = {
  type: "line",
  data: {
    labels: "",
    datasets: [
      {
        label: "CH0",
        data: "",
        borderColor: "rgba(240, 52, 52, 1)",
        backgroundColor: "rgba(240, 52, 52, 1)",
        yAxisID: "y",
      },
      {
        label: "CH1",
        data: "",
        borderColor: "rgba(44, 130, 201, 1)",
        backgroundColor: "rgba(44, 130, 201, 1)",
        yAxisID: "y1",
      },
    ],
  },
  options: {
    responsive: true,
    plugins: {
      zoom: {
        pan: {
          enabled: true,
          modifierKey: "ctrl",
          mode: "x",
        },
        zoom: {
          drag: {
            enabled: true,
            backgroundColor: "rgba(225,225,225)",
            borderColor: "rgba(225,225,225)",
          },
          wheel: {
            enabled: true,
            speed: 1,
          },
          mode: "x",
        },
      },
    },
    datasets: {
      line: {
        pointRadius: 0,
      },
    },
    animation: false,
    spanGaps: true,
    scales: {
      y: {
        beginAtZero: false,
      },
      y1: {
        beginAtZero: false,
      },
    },
  },
};

function visualizeData__1(param1, param2, param3) {
  chartConfig.data.labels = param3;
  chartConfig.data.datasets[0].data = param1;
  chartConfig.data.datasets[1].data = param2;
  chart__1 = new Chart(chartSelector__1, chartConfig);
}

function visualizeData__2(param1, param2, param3) {
  chartConfig.data.labels = param3;
  chartConfig.data.datasets[0].data = param1;
  chartConfig.data.datasets[1].data = param2;
  chart__2 = new Chart(chartSelector__2, chartConfig);
}

function resetChartZoom() {
  chart__1.resetZoom();
  chart__2.resetZoom();
}

export { visualizeData__1, visualizeData__2, resetChartZoom };
