"use strict";
import axios, { Axios } from "axios";
import zoomPlugin from "chartjs-plugin-zoom";
import Chart from "chart.js/auto";

Chart.register(zoomPlugin);
const indicator__container = document.querySelector(".indicator");
const dataContainer = document.querySelector(".tableContainer");

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
        <tr>
          <th colspan="2">Data Yang Tersedia</th>
        </tr>`;
      tableSection.insertAdjacentHTML("afterbegin", htmlHeader);

      data.forEach((ele) => {
        const htmlBody = `
        <tr> 
          <td>${ele}</td>
        </tr>`;
        //   <td>
        //   <button
        //   data = "${ele}"
        //   id="test__btn"
        //   class="
        //   bg-blue-500
        //   hover:bg-blue-700
        //   text-white
        //   font-bold
        //   py-2
        //   px-4
        //   rounded-full
        // "
        // >
        //   Click me
        // </button> </td>
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

  const sendGetRequest = async () => {
    try {
      const response = await axios.get(url);
      const data = response.data.info;
      const header = Object.keys(data[0]);

      // ! TEMPERATURE & HUMIDITY
      if (header[1] === "CH0") {
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
      if (header[1] === "TIME") {
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
            `** Indikasi ${toArray[i]} Terjadi Sebanyak : ${newCtr} Kali`
          );
          const indicator__content = document.createElement("h1");
          indicator__content.appendChild(indicator__text);
          indicator__container.appendChild(indicator__content);
          newCtr = 0;
        }
      }

      // ! HISTORY DATA
      if (header[1] === "PV-H") {
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

export { getData, getDataAll, postData, deleteData };
