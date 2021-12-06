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

function postData(identifier, inputBox, inputBox2, inputBox3, inputBox4) {
  const csvData__1 = document.getElementById(`${inputBox}`).files[0];
  const csvData__2 = document.getElementById(`${inputBox2}`).files[0];
  const csvData__3 = document.getElementById(`${inputBox3}`).files[0];
  const csvData__4 = document.getElementById(`${inputBox4}`).files[0];
  overlay.classList.remove("hidden");

  axios.get(`/view/dataone/info/${identifier}`).then((result) => {
    if (result.data.info) {
      if (result.data.info.length > 0) {
        alert(
          "Data pada tanggal tersebut sudah ada, silahkan masukkan tanggal data lain !"
        );
        overlay.classList.add("hidden");
      }
    } else {
      Papa.parse(csvData__1, {
        header: true,
        skipEmptyLines: true,
        fastMode: true,
        complete: function (results) {
          axios.post(`/upload/dataone/${identifier}`, results.data).then(() => {
            Papa.parse(csvData__2, {
              header: true,
              skipEmptyLines: true,
              fastMode: true,
              complete: function (results) {
                axios
                  .post(`/upload/datatwo/${identifier}`, results.data)
                  .then(() => {
                    Papa.parse(csvData__3, {
                      header: true,
                      skipEmptyLines: true,
                      fastMode: true,
                      complete: function (results) {
                        axios
                          .post(`/upload/datathree/${identifier}`, results.data)
                          .then(() => {
                            Papa.parse(csvData__4, {
                              header: true,
                              skipEmptyLines: true,
                              fastMode: true,
                              complete: function (results) {
                                axios
                                  .post(
                                    `/upload/datafour/${identifier}`,
                                    results.data
                                  )
                                  .then(() => {
                                    // alert(`Semua data berhasil ditambahkan !`);
                                    overlay.classList.add("hidden");
                                    location.reload();
                                  });
                              },
                            });
                          });
                      },
                    });
                  });
              },
            });
          });
        },
      });
    }
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
    postData(
      dataId,
      "uploadFile1",
      "uploadFile2",
      "uploadFile3",
      "uploadFile4"
    );
  }
});
