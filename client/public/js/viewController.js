"use strict";
import { getData, getDataAll } from "./crud";

const dataTable = document.querySelector(".table__1");
const dataTable3 = document.querySelector(".table__3");
const dataTable4 = document.querySelector(".table__4");
const dataIdentity = document.querySelector(".data__identity");
const canvas1 = document.querySelector("#chart__1");
const canvas2 = document.querySelector("#chart__2");
const searchField = document.querySelector(".search__container");
// ---------------------------------------------------------- //
const identifierHeading = document.querySelector(".identifier__heading");
const identifierField = document.querySelector(".identifier__field");
const reloadDocs = document.querySelector(".reload__btn");
const indicatorHumidity = document.querySelector(".indicator");
const lookDataBtn = document.querySelector(".look__data");
const exportChart1Btn = document.querySelector("#export__btn_chart__1");
const exportChart2Btn = document.querySelector("#export__btn_chart__2");
// --------------------------------------------------------- //

const url = "http://localhost:5000";

// ** Functions

function availableData() {
  getDataAll(url, "dataone", dataTable);
}

function clearGUI() {
  dataTable3.innerHTML = "";
  dataTable4.innerHTML = "";
  indicatorHumidity.innerHTML = "";
}

function downloadToPdf(canvas) {
  const chartToImg = canvas.toDataURL("image/jpeg", 1.0);
  let pdf = new jsPDF("portrait");
  pdf.setFontSize(15);
  pdf.addImage(chartToImg, "JPEG", 15, 15, 180, 90);
  pdf.save(`${canvas.getAttribute("id")}.pdf`);
}

// ** Event Listeners

lookDataBtn.addEventListener("click", () => {
  const identifier = document.querySelector(".identifier__value").value;
  if (!identifier || identifier.length < 8) {
    alert("Tolong Masukkan Input Data Dengan Benar");
  } else {
    dataIdentity.textContent = `Menampilkan Data ${identifier}`;
    reloadDocs.classList.remove("hidden");
    clearGUI();
    getData(url, "datafour", identifier, dataTable4);
    getData(url, "datathree", identifier, dataTable3);
    getData(url, "datatwo", identifier, "", "chart__2");
    getData(url, "dataone", identifier, "", "chart__1");
    lookDataBtn.classList.add("hidden");
    identifierField.classList.add("hidden");
    identifierHeading.classList.add("hidden");
    searchField.classList.add("hidden");
  }
});

reloadDocs.addEventListener("click", () => {
  location.reload();
});

exportChart1Btn.addEventListener("click", () => {
  downloadToPdf(canvas1);
});

exportChart2Btn.addEventListener("click", () => {
  downloadToPdf(canvas2);
});

function start() {
  availableData();
}

start();
