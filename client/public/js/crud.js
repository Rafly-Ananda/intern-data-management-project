"use strict";
import axios, { Axios } from "axios";
import zoomPlugin from "chartjs-plugin-zoom";
import Chart from "chart.js/auto";

Chart.register(zoomPlugin);
const bgColor = {
  id: "bgColor",
  beforeDraw: (chart, options) => {
    const { ctx, width, height } = chart;
    ctx.fillStyle = "#f0ffff";
    ctx.fillRect(0, 0, width, height);
    ctx.restore();
  },
};
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
  const param1 = [];
  const param2 = [];
  const param3 = [];

  const sendGetRequest = async () => {
    try {
      const response = await axios.get(url);
      const data = response.data.info;
      const header = Object.keys(data[0]);

      console.log(header[1]);

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
          plugins: [bgColor],
        });
      }

      // ! FOR DATA TYPE ACT - CONTENT
      if (header[1] === "TIME") {
        const htmlHeader = `
        <tr>
          <th>${header[1]}</th>
          <th>${header[0]}</th>
          <th>${header[2]}</th>
        </tr>`;
        tableSection.insertAdjacentHTML("afterbegin", htmlHeader);

        const contentIndicator = new Array();
        let counter1 = 0;
        let counter2 = 0;
        let counter3 = 0;
        let counter4 = 0;
        let counter5 = 0;
        let counter6 = 0;
        let counter7 = 0;
        let counter8 = 0;
        let counter9 = 0;
        let counter10 = 0;
        let counter11 = 0;
        let counter12 = 0;
        let counter13 = 0;
        let counter14 = 0;
        let counter15 = 0;
        let counter16 = 0;

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

          if (dataCounter === "motortidakberputar") counter5++;
          if (dataCounter === "emergencystopactive") counter6++;
          if (dataCounter === "temperaturesensordisconnect") counter7++;
          if (dataCounter === "humiditysensordisconnect") counter8++;

          if (dataCounter === "temptoolongreach") counter9++;
          if (dataCounter === "humiditytoolongreach") counter10++;
          if (dataCounter === "pintudibukaterlalulama") counter11++;
          if (dataCounter === "thermostaterror") counter12++;

          if (dataCounter === "sensoreggturninglefterror") counter13++;
          if (dataCounter === "sensoreggturningrighterror") counter14++;
          if (dataCounter === "sensordampererror") counter15++;
          if (dataCounter === "fantrip") counter16++;

          const htmlBody = `
              <tr>
                <td>${Object.values(ele)[1]}</td>
                <td>${Object.values(ele)[0]}</td>
                <td>${Object.values(ele)[2]}</td>
              </tr>`;
          tableSection.insertAdjacentHTML("beforeend", htmlBody);
        });

        // TODO FIX LATER FINDING UNIQUE OBJECTS
        // const contentIndicatorUnique = new Set([...contentIndicator]);
        // const toArray = [...contentIndicatorUnique];
        // console.log(toArray);
        // contentIndicator.forEach((element) => {
        //   let xoxo = 0;
        //   while (xoxo < toArray.length) {
        //     if (toArray[xoxo] === element) counter1++;
        //     xoxo++;
        //   }
        // });

        const indicator = `
        <h1> ** Indikasi Motor Tidak Berputar Terjadi Sebanyak : ${counter5} kali</h1>
        <h1> ** Indikasi Temperature Too High Terjadi Sebanyak : ${counter3} kali</h1>
        <h1> ** Indikasi Temperature Too Low Terjadi Sebanyak : ${counter1} kali</h1>
        <h1> ** Indikasi Humidity Too High Terjadi Sebanyak : ${counter4} kali</h1>
        <h1> ** Indikasi Humidity Too Low Terjadi Sebanyak : ${counter2} kali</h1>
        <h1> ** Indikasi Emergency Stop Active Terjadi Sebanyak : ${counter6} kali</h1>
        <h1> ** Indikasi Temperature Censor Disconnect Terjadi Sebanyak : ${counter7} kali</h1>
        <h1> ** Indikasi Humidity Censor Disconnect Terjadi Sebanyak : ${counter8} kali</h1>
        <h1> ** Indikasi Temp Too Long Reach Terjadi Sebanyak : ${counter9} kali</h1>
        <h1> ** Indikasi Humidity Too Long Reach Terjadi Sebanyak : ${counter10} kali</h1>
        <h1> ** Indikasi Pintu Dibuka Terlalu Lama Terjadi Sebanyak : ${counter11} kali</h1>
        <h1> ** Indikasi Thermostat Error Terjadi Sebanyak : ${counter12} kali</h1>
        <h1> ** Indikasi Censor Egg Turning Left Error Terjadi Sebanyak : ${counter13} kali</h1>
        <h1> ** Indikasi Censor Egg Turning Right Error Terjadi Sebanyak : ${counter14} kali</h1>
        <h1> ** Indikasi Censor Damper Error Terjadi Sebanyak : ${counter15} kali</h1>
        <h1> ** Indikasi Fan Trip Terjadi Sebanyak : ${counter16} kali</h1>`;

        mainContainer.insertAdjacentHTML("afterbegin", indicator);
      }

      // ! FOR DATA TYPE PVH
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
