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

// function postData(database, identifier, inputBox) {
//   const csvData = document.getElementById(`${inputBox}`).files[0];
//   Papa.parse(csvData, {
//     header: true,
//     skipEmptyLines: true,
//     fastMode: true,
//     complete: function (results) {
//       const sendPostRequest = () => {
//         try {
//           overlay.classList.remove("hidden");
//           const postRequest = axios.post(
//             `/upload/${database}/${identifier}`,
//             results.data
//           );
//           postRequest.then(() => {
//             alert(`Data ${csvData.name} sudah ditambakan kedalam database`);
//           });
//         } catch (error) {
//           console.log(error);
//         }
//       };
//       sendPostRequest();
//     },
//   });
// }

function postData(identifier, inputBox, inputBox2, inputBox3, inputBox4) {
  const csvData__1 = document.getElementById(`${inputBox}`).files[0];
  const csvData__2 = document.getElementById(`${inputBox2}`).files[0];
  const csvData__3 = document.getElementById(`${inputBox3}`).files[0];
  const csvData__4 = document.getElementById(`${inputBox4}`).files[0];
  overlay.classList.remove("hidden");

  Papa.parse(csvData__1, {
    header: true,
    skipEmptyLines: true,
    fastMode: true,
    complete: function (results) {
      axios.post(`/upload/dataone/${identifier}`, results.data).then(() => {
        alert(`data ${csvData__1.name} sudah ditambahkan`);

        Papa.parse(csvData__2, {
          header: true,
          skipEmptyLines: true,
          fastMode: true,
          complete: function (results) {
            overlay.classList.remove("hidden");
            axios
              .post(`/upload/datatwo/${identifier}`, results.data)
              .then(() => {
                alert(`data ${csvData__2.name} sudah ditambahkan`);

                Papa.parse(csvData__3, {
                  header: true,
                  skipEmptyLines: true,
                  fastMode: true,
                  complete: function (results) {
                    overlay.classList.remove("hidden");
                    axios
                      .post(`/upload/datathree/${identifier}`, results.data)
                      .then(() => {
                        alert(`data ${csvData__3.name} sudah ditambahkan`);

                        Papa.parse(csvData__4, {
                          header: true,
                          skipEmptyLines: true,
                          fastMode: true,
                          complete: function (results) {
                            overlay.classList.remove("hidden");
                            axios
                              .post(
                                `/upload/datafour/${identifier}`,
                                results.data
                              )
                              .then(() => {
                                alert(
                                  `data ${csvData__4.name} sudah ditambahkan`
                                );
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
