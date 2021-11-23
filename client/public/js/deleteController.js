"use strict";
import { getDataAll, deleteData } from "./crud";

const dataTable = document.querySelector(".tableTable");

const url = "http://localhost:8080";

function availableData() {
  getDataAll(url, "dataone", dataTable);
}

document.getElementById("deleteData").addEventListener("click", () => {
  try {
    const identifier = document.querySelector(".getDataIdentifier").value;
    if (!identifier || identifier.length < 8) {
      alert("Tolong Masukkan Input Data Dengan Benar");
    } else {
      deleteData(url, identifier);
    }
  } catch (error) {
    console.log(error);
  }
});

availableData();
