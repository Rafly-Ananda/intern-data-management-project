"use strict";
import axios, { Axios } from "axios";
import zoomPlugin from "chartjs-plugin-zoom";
import Chart from "chart.js/auto";

Chart.register(zoomPlugin);
const mainContainer = document.querySelector(".indicator");
const dataContainer = document.querySelector(".tableContainer");

let chart;

// ? POST REQUEST
// ! ========================== ! \\
function postData(endPoint, data) {
  const sendPostRequest = async () => {
    try {
      await axios.post(endPoint, data);
      alert("Data Berhasil Ditambahkan");
      location.reload();
    } catch (error) {
      console.log(error);
    }
  };
  sendPostRequest();
}

// ? GET REQUEST ( ALL )
// ! ========================== ! \\
function getDataAll(endPoint, dataBase, tableSection) {
  const url = `${endPoint}/view/${dataBase}/info`;
  const sendGetRequest = async () => {
    try {
      const response = await axios.get(url);
      const data = response.data;
      const htmlHeader = `
      <table class="tableTable">
        <tr>
          <td>Data Yang Tersedia</td>
        </tr>
      </table>`;
      tableSection.insertAdjacentHTML("afterbegin", htmlHeader);

      data.forEach((ele) => {
        const htmlBody = `
        <table class="tableTable">
        <tr>
        <td>${ele}</td>
      </tr>
      </table>`;
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
function getData(endPoint, dataBase, identifier, tableSection, graphSection) {
  const url = `${endPoint}/view/${dataBase}/info/${identifier}`;
  const param1 = [];
  const param2 = [];
  const param3 = [];

  const sendGetRequest = async () => {
    try {
      const response = await axios.get(url);
      const data = response.data.info;
      const header = Object.keys(data[0]);

      // ! FOR DATA TYPE CH0 - CH1
      if (header[1] === "CH0") {
        data.forEach((ele) => {
          param1.push(Object.values(ele)[1]);
          param2.push(Object.values(ele)[2]);
          param3.push(Object.values(ele)[3]);
        });

        // **CHART JS
        const ctx = document.getElementById(`${graphSection}`).getContext("2d");
        chart = new Chart(ctx, {
          type: "line",
          data: {
            labels: param3,
            datasets: [
              {
                label: "CH1",
                data: param2,
                borderColor: "rgba(44, 130, 201, 0.5)",
                backgroundColor: "rgba(44, 130, 201, 0.5)",
              },
              {
                label: "CH0",
                data: param1,
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
        });
      }

      // ! FOR DATA TYPE ACT - CONTENT
      if (header[1] === "TIME") {
        const htmlHeader = `
      <table class="tableTable">
        <tr>
          <td>${header[1]}</td>
          <td>${header[0]}</td>
          <td>${header[2]}</td>
        </tr>
      </table>`;
        tableSection.insertAdjacentHTML("afterbegin", htmlHeader);

        const contentIndicator = new Array();
        let counter1 = 0;
        let counter2 = 0;
        let counter3 = 0;
        let counter4 = 0;

        data.forEach((ele) => {
          const dataCounter = Object.values(ele)[2]
            .toLowerCase()
            .split(" ")
            .join("");
          contentIndicator.push(dataCounter);

          if (dataCounter === "temperaturetoolow") counter1++;
          if (dataCounter === "humiditytoolow") counter2++;
          if (dataCounter === "temperaturetoohigh") counter3++;
          if (dataCounter === "humiditytoohigh") counter4++;

          const htmlBody = `
            <table class="tableTable">
              <tr>
                <td>${Object.values(ele)[1]}</td>
                <td>${Object.values(ele)[0]}</td>
                <td>${Object.values(ele)[2]}</td>
              </tr>
            </table>`;
          tableSection.insertAdjacentHTML("beforeend", htmlBody);
        });

        // TODO FIX LATER FINDING UNIQUE OBJECTS
        // const contentIndicatorUnique = new Set([...contentIndicator]);
        // const toArray = [...contentIndicatorUnique];
        // contentIndicator.forEach((element) => {
        //   let xoxo = 0;
        //   while (xoxo < toArray.length) {
        //     if (toArray[xoxo] === element) counter1++;
        //     xoxo++;
        //   }
        // });

        const indicator = `
        <h1> ** Indikasi Temperature Too High Terjadi Sebanyak : ${counter3} kali</h1>
        <h1> ** Indikasi Temperature Too Low Terjadi Sebanyak : ${counter1} kali</h1>
        <h1> ** Indikasi Humidity Too High Terjadi Sebanyak : ${counter4} kali</h1>
        <h1> ** Indikasi Humidity Too Low Terjadi Sebanyak : ${counter2} kali</h1>`;

        mainContainer.insertAdjacentHTML("afterbegin", indicator);
      }

      // ! FOR DATA TYPE PVH
      if (header[1] === "PV-H") {
        const htmlHeader = `
      <table class="tableTable">
        <tr>
          <td>${header[5]}</td>
          <td>${header[2]}</td>
          <td>${header[4]}</td>
          <td>${header[1]}</td>
          <td>${header[3]}</td>
        </tr>
      </table>`;
        tableSection.insertAdjacentHTML("afterbegin", htmlHeader);

        data.forEach((ele) => {
          const htmlBody = `
            <table class="tableTable">
              <tr>
                <td>${Object.values(ele)[5]}</td>
                <td>${Object.values(ele)[2]}</td>
                <td>${Object.values(ele)[4]}</td>
                <td>${Object.values(ele)[1]}</td>
                <td>${Object.values(ele)[3]}</td>
              </tr>
            </table>`;
          tableSection.insertAdjacentHTML("beforeend", htmlBody);
        });
      }
      dataContainer.classList.remove("hidden");
    } catch (error) {
      console.log(error);
      alert("data tidak tersedia");
      dataContainer.classList.add("hidden");
    }
  };
  sendGetRequest();
}

// ? DELETE REQUEST ( SPECIFIC )
function deleteData(endPoint, identifier) {
  const url = `${endPoint}/delete/${identifier}`;
  const sendDeleteRequest = async () => {
    try {
      await axios.delete(url);
      alert("Data Deleted");
      location.reload();
    } catch (error) {
      console.log(error);
    }
  };
  sendDeleteRequest();
}

function resetChartZoom() {
  chart.resetZoom();
}

export { getData, getDataAll, postData, deleteData, resetChartZoom };
