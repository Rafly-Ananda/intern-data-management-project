"use strict";
import axios, { Axios } from "axios";
import zoomPlugin from "chartjs-plugin-zoom";
import Chart from "chart.js/auto";

Chart.register(zoomPlugin);
const indicator__container = document.querySelector(".indicator");
const indicator__container__export =
  document.querySelector(".indicator__export");
const data__container = document.querySelector(".table__container");

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
              {
                label: header[2],
                data: chartParam__2,
                borderColor: "rgba(44, 130, 201, 0.5)",
                backgroundColor: "rgba(44, 130, 201, 0.5)",
              },
              {
                label: header[1],
                data: chartParam__1,
                borderColor: "rgba(240, 52, 52, 1)",
                backgroundColor: "rgba(240, 52, 52, 0.5)",
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
  const medionImg =
    "data:image/png;base64,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";
  indicator__container.classList.add("smallTxt");
  const chartToImg1 = canvas1.toDataURL("image/jpeg", 1.0);
  const chartToImg2 = canvas2.toDataURL("image/jpeg", 1.0);
  const documentNo = prompt(`( Maksimal 12 Karakter )
Masukkan Format No Dokumen : `);

  let pdf = new jsPDF({
    orientation: "portrait",
    format: "a4",
  });

  pdf.addImage(medionImg, 10, 14, 40, 13);
  pdf.addImage(chartToImg1, "JPEG", 11.5, 47, 90, 58, "chart1");
  pdf.addImage(chartToImg2, "JPEG", 108.5, 47, 90, 58, "chart2");
  pdf.fromHTML(indicator__container, 28, 157);

  // ** Texts
  pdf.setFont("times", "bold");
  pdf.setFontSize(17);
  pdf.text(77, 21.5, "Report Data Mesin");
  pdf.setFont("times", "normal");
  pdf.setFontSize(8);
  pdf.text(12, 110, "Catatan :");
  pdf.text(109, 110, "Catatan :");
  pdf.text(109, 153, "Kesimpulan :");
  pdf.text(42, 153, "Indikator Alarm Historis");
  pdf.setFontSize(9);
  pdf.text(15, 45, "Grafik Data Humidity");
  pdf.text(115, 45, "Grafik Data Temperatur");
  pdf.text(154, 16, "No. Dokumen");
  pdf.text(180, 16, documentNo);
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
  // ! lines(vertical) - top point, height from top, bot point, height to bot
  pdf.line(55, 10, 55, 30); // Medion Logo Box
  pdf.line(150, 10, 150, 30); // Doc & Revision NO Box
  pdf.line(175, 10, 175, 30); // Doc & Revision Separator
  pdf.line(187, 20, 187, 30); // Doc & Revision Separator Content
  // ! lines(horizontal) - left point, length from right, right point, lengh from left
  pdf.line(150, 20, 204, 20);
  // ** Signature Box
  pdf.rect(6, 255, 198, 28);
  // ** Alarm Indicator Box
  pdf.rect(10, 147.5, 93, 75);
  // ** Summary Box
  pdf.rect(107, 147.5, 93, 75);
  // pdf.rect(10, 85, 90, 40);
  // pdf.rect(110, 85, 90, 40);

  pdf.save(`all.pdf`);
  indicator__container.classList.remove("smallTxt");
}

// ** Event Listeners

lookDataBtn.addEventListener("click", () => {
  const identifier = document.querySelector(".identifier__value").value;
  if (!identifier || identifier.length < 8) {
    alert("Tolong Masukkan Input Data Dengan Benar");
  } else {
    dataIdentity.textContent = `Menampilkan Data ${identifier}`;
    reloadDocs.classList.remove("hidden");
    exportAllBtn.classList.remove("hidden");
    clearGUI();
    getData("datafour", identifier, dataTable4);
    getData("datathree", identifier, dataTable3);
    getData("datatwo", identifier, "", "chart__2");
    getData("dataone", identifier, "", "chart__1");
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

exportAllBtn.addEventListener("click", () => {
  exportAll(canvas1, canvas2);
});

function start() {
  getDataAll("datafour", dataTable);
}

start();
