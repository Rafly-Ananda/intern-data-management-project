"use strict";
import { getData, getDataAll } from "./crud";

const dataTable = document.querySelector(".tableTable");
const dataTable2 = document.querySelector(".tableTable2");
const dataTable3 = document.querySelector(".tableTable3");
const dataTable4 = document.querySelector(".tableTable4");
const dataIdentity = document.querySelector(".data__identity");
const canvas1 = document.querySelector("#chart__1");
const canvas2 = document.querySelector("#chart__2");
const slides = document.querySelectorAll(".slide");
// ---------------------------------------------------------- //
const identifierField = document.querySelector(".getDataIdentifier");
const identifierHeading = document.querySelector(".identifierHeading");
const lookDataBtn = document.getElementById("downloadData");
const reloadDocs = document.getElementById("reloadDocs");
const indicatorHumidity = document.querySelector(".indicator");
const getDataBtn = document.querySelector("#downloadData");
const exportChart1Btn = document.querySelector("#export__btn_chart__1");
const exportChart2Btn = document.querySelector("#export__btn_chart__2");
// --------------------------------------------------------- //

const url = "http://localhost:5000";

// ** Functions

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

function downloadToPdf(canvas) {
  const chartToImg = canvas.toDataURL("image/jpeg", 1.0);
  let pdf = new jsPDF("portrait");
  pdf.setFontSize(15);
  // pdf.addImage(chartToImg, "JPEG", 10, 10, 220, 115);
  pdf.addImage(chartToImg, "JPEG", 15, 15, 180, 90);
  pdf.save(`${canvas.getAttribute("id")}.pdf`);
}

function goToSlide(pages) {
  slides.forEach((slide, index) => {
    slide.style.transform = `translateX(${100 * (index - pages)}%)`;
  });
}

// ** Event Listeners

getDataBtn.addEventListener("click", () => {
  const identifier = document.querySelector(".getDataIdentifier").value;
  if (!identifier || identifier.length < 8) {
    alert("Tolong Masukkan Input Data Dengan Benar");
  } else {
    dataIdentity.textContent = `Menampilkan Data ${identifier}`;
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

exportChart1Btn.addEventListener("click", () => {
  downloadToPdf(canvas1);
});

exportChart2Btn.addEventListener("click", () => {
  downloadToPdf(canvas2);
});

function start() {
  goToSlide(0);
  availableData();
}

start();

// document.body.addEventListener("click", function (event) {
//   if (event.target.id == "test__btn") {
//     const btn = document.querySelectorAll("#test__btn");
//     btn.forEach((ele) => {
//       ele.addEventListener("click", () => {
//         const identifier = ele.getAttribute("data");
//         if (!lookDataBtn.classList.contains("hidden")) {
//           reloadDocs.classList.remove("hidden");
//           clearGUI();
//           getData(url, "datafour", identifier, dataTable4);
//           getData(url, "datathree", identifier, dataTable3);
//           getData(url, "datatwo", identifier, dataTable2, "chart__2");
//           getData(url, "dataone", identifier, dataTable, "chart__1");
//           lookDataBtn.classList.add("hidden");
//           identifierField.classList.add("hidden");
//           identifierHeading.classList.add("hidden");
//         } else {
//           location.reload();
//         }
//       });
//     });
//   }
// });
