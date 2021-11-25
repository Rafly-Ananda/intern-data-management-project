"use strict";
import Papa from "papaparse";
import { postData } from "./crud";

const uploadFile1 = document.getElementById("uploadFile1");
const uploadFile2 = document.getElementById("uploadFile2");
const uploadFile3 = document.getElementById("uploadFile3");
const uploadFile4 = document.getElementById("uploadFile4");
const uploadDataBtn = document.getElementById("uploadConfirm");

const url = "http://localhost:8080";

// ** Functions

function uploadData(database, identifier, inputBox) {
  Papa.parse(document.getElementById(`${inputBox}`).files[0], {
    download: true,
    header: true,
    skipEmptyLines: true,
    fastMode: true,
    complete: function (results) {
      postData(`${url}/upload/${database}/${identifier}`, results.data);
    },
  });
}

// ** Event Listeners

uploadDataBtn.addEventListener("click", () => {
  const dataId = document.querySelector(".identifierSelector").value;
  if (
    uploadFile1.files.length == 0 ||
    uploadFile2.files.length == 0 ||
    uploadFile3.files.length == 0 ||
    uploadFile4.files.length == 0 ||
    !dataId
  ) {
    alert("Isi Semua Field Input!");
  } else {
    uploadData("dataone", dataId, "uploadFile1");
    uploadData("datatwo", dataId, "uploadFile2");
    uploadData("datathree", dataId, "uploadFile3");
    uploadData("datafour", dataId, "uploadFile4");
  }
});
