"use strict";
import axios, { Axios } from "axios";
import zoomPlugin from "chartjs-plugin-zoom";
import Chart from "chart.js/auto";
const imgUrl = require("../assets/img-url.json");

Chart.register(zoomPlugin);
const indicator__container = document.querySelector(".indicator");
const data__container = document.querySelector(".table__container");

const dataTable = document.querySelector(".table__1");
const dataTable3 = document.querySelector(".table__3");
const dataTable4 = document.querySelector(".table__4");
const dataIdentity = document.querySelector(".data__identity");
const canvas1 = document.querySelector("#chart__1");
const canvas2 = document.querySelector("#chart__2");
const searchField = document.querySelector(".search__container");
const overlay = document.querySelector(".overlay");
// ---------------------------------------------------------- //
const identifierHeading = document.querySelector(".identifier__heading");
const identifierField = document.querySelector(".identifier__field");
const reloadDocs = document.querySelector(".reload__btn");
const indicatorHumidity = document.querySelector(".indicator");
const lookDataBtn = document.querySelector(".look__data");
const exportChart1Btn = document.querySelector("#export__btn_chart__1");
const exportChart2Btn = document.querySelector("#export__btn_chart__2");
const exportAllBtn = document.querySelector(".export__all__btn");
// --------------------------------------------------------- //

// ** Functions

function getDataAll(dataBase, tableSection) {
  const url = `/view/${dataBase}/info`;
  const sendGetRequest = async () => {
    try {
      const response = await axios.get(url);
      const data = response.data;
      const htmlHeader = `
        <tr>
          <th colspan="2">Data Yang Tersedia</th>
        </tr>`;
      tableSection.insertAdjacentHTML("afterbegin", htmlHeader);

      data.forEach((ele) => {
        const htmlBody = `
        <tr> 
          <td>${ele}</td>
        </tr>`;
        tableSection.insertAdjacentHTML("beforeend", htmlBody);
      });
    } catch (error) {
      console.log(error);
    }
  };
  sendGetRequest();
}

// ? GET REQUEST ( SPECIFIC )
// ! ========================== ! \\
function getData(dataBase, identifier, tableSection, graphSection) {
  const sendGetRequest = async () => {
    try {
      const response = await axios.get(`/view/${dataBase}/info/${identifier}`);
      const data = response.data.info;
      const header = Object.keys(data[0]);

      // ! TEMPERATURE & HUMIDITY
      if (header.includes("CH0")) {
        let chart;

        const chartParam__1 = new Array();
        const chartParam__2 = new Array();
        const chartParam__3 = new Array();
        data.forEach((ele) => {
          chartParam__1.push(Object.values(ele)[1]);
          chartParam__2.push(Object.values(ele)[2]);
          chartParam__3.push(Object.values(ele)[3]);
        });

        // **CHART JS
        const config = {
          type: "line",
          data: {
            labels: chartParam__3,
            datasets: [
              // Normal Line
              {
                label: header[2],
                data: chartParam__2,
                borderColor:
                  data[0].CH0.length < 4
                    ? "rgba(0, 0, 0, 0.5)"
                    : "rgba(44, 130, 201, 0.5)",
                backgroundColor:
                  data[0].CH0.length < 4
                    ? "rgba(0, 0, 0, 0.5)"
                    : "rgba(44, 130, 201, 0.5)",
              },
              {
                // Graphic Line
                label: header[1],
                data: chartParam__1,
                borderColor:
                  data[0].CH0.length < 4
                    ? "rgba(43, 108, 176, 1)"
                    : "rgba(240, 52, 52, 1)",
                backgroundColor:
                  data[0].CH0.length < 4
                    ? "rgba(43, 108, 176, 0.5)"
                    : "rgba(240, 52, 52, 0.5)",
              },
            ],
          },
          options: {
            plugins: {
              zoom: {
                pan: {
                  enabled: true,
                  mode: "x",
                  modifierKey: "alt",
                },
                zoom: {
                  drag: {
                    enabled: true,
                    backgroundColor: "rgba(225,225,225)",
                    borderColor: "rgba(225,225,225)",
                  },
                  wheel: {
                    enabled: true,
                    speed: 0.5,
                    modifierKey: "ctrl",
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
          },
          plugins: [
            {
              id: "bgColor",
              beforeDraw: (chart, options) => {
                const { ctx, width, height } = chart;
                ctx.fillStyle = "#f0ffff";
                ctx.fillRect(0, 0, width, height);
                ctx.restore();
              },
            },
          ],
        };

        const ctx = document.getElementById(`${graphSection}`).getContext("2d");
        chart = new Chart(ctx, config);
      }

      // ! ALARM HISTORIS
      if (header.includes("CONTENT")) {
        const contentIndicator = new Array();
        const htmlHeader = `
        <tr>
          <th>${header[1]}</th>
          <th>${header[0]}</th>
          <th>${header[2]}</th>
        </tr>`;
        tableSection.insertAdjacentHTML("afterbegin", htmlHeader);

        data.forEach((ele) => {
          const dataCounter = Object.values(ele)[2];
          contentIndicator.push(dataCounter);

          const htmlBody = `
              <tr>
                <td>${Object.values(ele)[1]}</td>
                <td>${Object.values(ele)[0]}</td>
                <td>${Object.values(ele)[2]}</td>
              </tr>`;
          tableSection.insertAdjacentHTML("beforeend", htmlBody);
        });

        const contentIndicatorUnique = new Set([...contentIndicator]);
        const toArray = [...contentIndicatorUnique];

        let counter = 0;
        for (let i = 0; i < toArray.length; i++) {
          for (let j = 0; j < contentIndicator.length; j++) {
            if (toArray[i] === contentIndicator[j]) {
              counter++;
            }
          }
          const indicator__text = document.createTextNode(
            `** ${toArray[i]} Terjadi Sebanyak : ${counter} Kali`
          );
          const indicator__content = document.createElement("h1");
          indicator__content.appendChild(indicator__text);
          indicator__container.appendChild(indicator__content);
          counter = 0;
        }
      }

      // ! HISTORY DATA
      if (header.includes("PV-H")) {
        const htmlHeader = `
        <tr>
          <th>${header[5]}</th>
          <th>${header[2]}</th>
          <th>${header[4]}</th>
          <th>${header[1]}</th>
          <th>${header[3]}</th>
        </tr>`;
        tableSection.insertAdjacentHTML("afterbegin", htmlHeader);

        data.forEach((ele) => {
          const htmlBody = `
              <tr>
                <td>${Object.values(ele)[5]}</td>
                <td>${Object.values(ele)[2]}</td>
                <td>${Object.values(ele)[4]}</td>
                <td>${Object.values(ele)[1]}</td>
                <td>${Object.values(ele)[3]}</td>
              </tr>`;
          tableSection.insertAdjacentHTML("beforeend", htmlBody);
        });
      }
      data__container.classList.remove("hidden");
    } catch (error) {
      console.log(error);
      alert("data tidak tersedia");
      data__container.classList.add("hidden");
    }
  };
  sendGetRequest();
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

function exportAll(canvas1, canvas2) {
  const medionImg = Object.values(imgUrl[0]).toString();
  indicator__container.classList.add("smallTxt");
  const chartToImg1 = canvas1.toDataURL("image/jpeg", 1.0);
  const chartToImg2 = canvas2.toDataURL("image/jpeg", 1.0);

  let pdf = new jsPDF({
    orientation: "portrait",
    format: "a4",
  });

  pdf.addImage(medionImg, 10, 14, 40, 13);
  pdf.addImage(chartToImg1, "JPEG", 11.5, 47, 90, 58, "chart1");
  pdf.addImage(chartToImg2, "JPEG", 108.5, 47, 90, 58, "chart2");
  pdf.fromHTML(indicator__container, 28, 158);

  // ** Texts
  pdf.setFont("times", "bold");
  pdf.setFontSize(17);
  pdf.text(77, 21.5, "Report Data Mesin");
  pdf.setFont("times", "normal");
  pdf.setFontSize(8);
  pdf.text(12, 110, "Catatan :");
  pdf.text(109, 110, "Catatan :");
  pdf.text(109, 152.5, "Kesimpulan Report Data Mesin (Diisi Oleh PD):");
  pdf.text(109, 160, "Catatan :"); // catatan kesimpulan
  pdf.text(170, 152.5, "OK");
  pdf.text(182, 152.5, "Tidak Ok");
  pdf.text(42, 155, "Indikator Alarm Historis");
  pdf.text(24, 238, "Diperiksa:");
  pdf.text(71, 238, "Menyimpulkan:");
  pdf.text(148, 238, "Menyetujui:");
  pdf.text(24.5, 265, "Operator");
  pdf.text(77.5, 265, "Staff");
  pdf.text(119.5, 265, "Assistant Manager");
  pdf.text(165.75, 265, "Manager/Senior Manager");
  pdf.setFont("times", "bold");
  pdf.text(
    10,
    274,
    `PT Medion Farma Jaya
Equipment Division
Jl. Raya Batujajar No. 29 Cimareme, Kab. Bandung Barat, Jawa Barat 26887 | www.medion.co.id`
  );
  pdf.setFont("times", "normal");
  pdf.setFontSize(9);
  pdf.text(15, 45, "Grafik Data Humidity");
  pdf.text(115, 45, "Grafik Data Temperatur");
  pdf.text(154, 16, "No. Dokumen");
  pdf.text(180, 16, "XX/XX/XXXX");
  pdf.text(154, 26, "No. Revisi");

  // ? Main PDF Layouting
  // ! Rectangle - horizontal, vertical, width, height
  // ** Chart 1 Border
  pdf.rect(10, 40, 93, 100);
  // ** Chart 2 Border
  pdf.rect(107, 40, 93, 100);
  // ** Outer
  pdf.rect(6, 10, 198, 273);
  // ** Header Box
  pdf.rect(6, 10, 198, 20);
  // ** Alarm Indicator Box
  pdf.rect(10, 147.5, 93, 75);
  // ** Summary Box
  pdf.rect(107, 147.5, 93, 75);
  // ** Ok Box
  pdf.rect(167, 150.75, 2, 2);
  // ** Not Ok Box
  pdf.rect(179, 150.75, 2, 2);
  // ! lines(vertical) - top point, height from top, bot point, height to bot
  pdf.line(55, 10, 55, 30); // Medion Logo Box
  pdf.line(150, 10, 150, 30); // Doc & Revision NO Box
  pdf.line(175, 10, 175, 30); // Doc & Revision Separator
  pdf.line(187, 20, 187, 30); // Doc & Revision Separator Content
  // ! lines(horizontal) - left point, length from right, right point, lengh from left
  pdf.line(150, 20, 204, 20);
  pdf.line(107, 155.5, 200, 155.5); // kesimpulan box checklist
  pdf.line(15, 260, 45, 260); // Signature Line PD NM
  pdf.line(65, 260, 95, 260); // Signature Line PD Staff
  pdf.line(115, 260, 145, 260); // Signature Line PD AM
  pdf.line(165, 260, 195, 260); // Signature Line Senior Manager
  pdf.line(6, 232, 204, 232); // Signature Box Separator top
  pdf.line(6, 270, 204, 270); // Signature Box Separator bot

  pdf.save(`all.pdf`);
  indicator__container.classList.remove("smallTxt");
}

// ** Event Listeners

lookDataBtn.addEventListener("click", () => {
  const identifier = document.querySelector(".identifier__value").value;
  if (!identifier || identifier.length < 8) {
    alert("Tolong Masukkan Input Data Dengan Benar");
  } else {
    clearGUI();
    dataIdentity.textContent = `Menampilkan Data ${identifier}`;
    overlay.classList.remove("hidden");
    axios
      .all([
        getData("datafour", identifier, dataTable4),
        getData("datathree", identifier, dataTable3),
        getData("datatwo", identifier, "", "chart__2"),
        getData("dataone", identifier, "", "chart__1"),
      ])
      .then(() => {
        overlay.classList.add("hidden");
        reloadDocs.classList.remove("hidden");
        exportAllBtn.classList.remove("hidden");
        lookDataBtn.classList.add("hidden");
        identifierField.classList.add("hidden");
        identifierHeading.classList.add("hidden");
        searchField.classList.add("hidden");
        console.log("finished");
      });
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

exportAllBtn.addEventListener("click", () => {
  exportAll(canvas1, canvas2);
});

function start() {
  getDataAll("datafour", dataTable);
}

start();
