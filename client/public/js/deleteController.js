"use strict";
import axios, { Axios } from "axios";

const dataTable = document.querySelector(".table__1");
const deleteDataBtn = document.querySelector(".delete__data");
const overlay = document.querySelector(".overlay");

//  ** Functions

function deleteData(identifier) {
  overlay.classList.remove("hidden");
  axios
    .get(`/view/dataone/info/${identifier}`)
    .then((result) => {
      if (result.data.info) {
        const sendDeleteRequest = async () => {
          try {
            await axios.delete(`/delete/${identifier}`);
            alert("Data Berhasil Dihapus");
            location.reload();
          } catch (error) {
            console.log(error);
          }
        };

        sendDeleteRequest();
      } else {
        alert(
          "Data pada tanggal tersebut sudah dihapus, silahkan masukkan tanggal data lain !"
        );
      }
    })
    .then(() => {
      overlay.classList.add("hidden");
    });
}

function getDataAll(dataBase, tableSection) {
  const sendGetRequest = async () => {
    try {
      const response = await axios.get(`/view/${dataBase}/info`);
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

// ** Event Listeners

deleteDataBtn.addEventListener("click", () => {
  try {
    const identifier = document.querySelector(".identifier__value").value;
    if (!identifier) {
      alert("Tolong Masukkan Input Data Dengan Benar");
    } else {
      deleteData(identifier);
    }
  } catch (error) {
    console.log(error);
  }
});

function start() {
  getDataAll("datafour", dataTable);
}

start();
