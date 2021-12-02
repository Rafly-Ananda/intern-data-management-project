"use strict";
import Papa from "papaparse";
import axios, { Axios } from "axios";

const uploadFile1 = document.getElementById("uploadFile1");
const uploadFile2 = document.getElementById("uploadFile2");
const uploadFile3 = document.getElementById("uploadFile3");
const uploadFile4 = document.getElementById("uploadFile4");
const uploadDataBtn = document.getElementById("uploadConfirm");
const overlay = document.querySelector(".overlay");

// ** Functions

function postData(database, identifier, inputBox) {
  const sendPostRequest = () => {
    try {
      Papa.parse(document.getElementById(`${inputBox}`).files[0], {
        download: true,
        header: true,
        skipEmptyLines: true,
        fastMode: true,
        complete: async function (results) {
          axios.post(`/upload/${database}/${identifier}`, results.data);
        },
      });
    } catch (error) {
      console.log(error);
    }
  };
  sendPostRequest();
}

// ** Event Listeners

uploadDataBtn.addEventListener("click", () => {
  const dataId = document.querySelector(".identifier__value").value;
  if (
    uploadFile1.files.length == 0 ||
    uploadFile2.files.length == 0 ||
    uploadFile3.files.length == 0 ||
    uploadFile4.files.length == 0 ||
    !dataId
  ) {
    alert("Isi Semua Field Input!");
  } else {
    const sendData = new Promise((resolve, reject) => {
      overlay.classList.remove("hidden");
      resolve(overlay.classList.add("hidden"));
    });

    sendData.then(() => {
      postData("dataone", dataId, "uploadFile1");
      postData("datatwo", dataId, "uploadFile2");
      postData("datathree", dataId, "uploadFile3");
      postData("datafour", dataId, "uploadFile4");
      alert("data berhasil ditambahkan");
    });
  }
});
