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
  let data;
  Papa.parse(document.getElementById(`${inputBox}`).files[0], {
    download: false,
    header: true,
    skipEmptyLines: true,
    fastMode: true,
    complete: function (results) {
      const sendPostRequest = async () => {
        try {
          await axios.post(`/upload/${database}/${identifier}`, results.data);
          alert(`data ${identifier} to ${database} added`);
        } catch (error) {
          console.log(error);
        }
      };
      sendPostRequest();
    },
  });
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
    postData("dataone", dataId, "uploadFile1");
    postData("datatwo", dataId, "uploadFile2");
    postData("datathree", dataId, "uploadFile3");
    postData("datafour", dataId, "uploadFile4");
  }
});
