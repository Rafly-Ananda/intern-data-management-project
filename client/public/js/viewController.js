"use strict";
import axios, { Axios } from "axios";
import zoomPlugin from "chartjs-plugin-zoom";
import Chart from "chart.js/auto";

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
// ---------------------------------------------------------- //
const identifierHeading = document.querySelector(".identifier__heading");
const identifierField = document.querySelector(".identifier__field");
const reloadDocs = document.querySelector(".reload__btn");
const indicatorHumidity = document.querySelector(".indicator");
const lookDataBtn = document.querySelector(".look__data");
const exportChart1Btn = document.querySelector("#export__btn_chart__1");
const exportChart2Btn = document.querySelector("#export__btn_chart__2");
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

        let newCtr = 0;
        for (let i = 0; i < toArray.length; i++) {
          for (let j = 0; j < contentIndicator.length; j++) {
            if (toArray[i] === contentIndicator[j]) {
              newCtr++;
            }
          }
          const indicator__text = document.createTextNode(
            `** ${toArray[i]} Terjadi Sebanyak : ${newCtr} Kali`
          );
          const indicator__content = document.createElement("h1");
          indicator__content.appendChild(indicator__text);
          indicator__container.appendChild(indicator__content);
          newCtr = 0;
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

// ** Event Listeners

lookDataBtn.addEventListener("click", () => {
  const identifier = document.querySelector(".identifier__value").value;
  if (!identifier || identifier.length < 8) {
    alert("Tolong Masukkan Input Data Dengan Benar");
  } else {
    dataIdentity.textContent = `Menampilkan Data ${identifier}`;
    reloadDocs.classList.remove("hidden");
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

function start() {
  getDataAll("dataone", dataTable);
}

start();
