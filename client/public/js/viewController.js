"use strict";
import { getData, getDataAll, resetChartZoom } from "./crud";

const dataTable = document.querySelector(".dataContainer");
const dataTable2 = document.querySelector(".dataContainer2");
const dataTable3 = document.querySelector(".dataContainer3");
const dataTable4 = document.querySelector(".dataContainer4");
// ---------------------------------------------------------- //
const identifierField = document.querySelector(".getDataIdentifier");
const identifierHeading = document.querySelector(".identifierHeading");
const lookDataBtn = document.getElementById("downloadData");
const reloadDocs = document.getElementById("reloadDocs");
const indicatorHumidity = document.querySelector(".indicator");
const graphResetBtn = document.querySelectorAll(".graphResetBtn");
// --------------------------------------------------------- //

const url = "http://localhost:8080";

function availableData() {
  getDataAll(url, "dataone", dataTable);
}

function clearGUI() {
  // dataTable.innerHTML = "";
  // dataTable2.innerHTML = "";
  dataTable3.innerHTML = "";
  dataTable4.innerHTML = "";
  indicatorHumidity.innerHTML = "";
}

document.getElementById("downloadData").addEventListener("click", () => {
  const identifier = document.querySelector(".getDataIdentifier").value;
  if (!identifier || identifier.length < 8) {
    alert("Tolong Masukkan Input Data Dengan Benar");
  } else {
    reloadDocs.classList.remove("hidden");
    clearGUI();
    getData(url, "datafour", identifier, dataTable4);
    getData(url, "datathree", identifier, dataTable3);
    getData(url, "datatwo", identifier, dataTable2, "chart__2");
    getData(url, "dataone", identifier, dataTable, "chart__1");
    lookDataBtn.classList.add("hidden");
    identifierField.classList.add("hidden");
    identifierHeading.classList.add("hidden");
  }
});

reloadDocs.addEventListener("click", () => {
  location.reload();
});

availableData();
