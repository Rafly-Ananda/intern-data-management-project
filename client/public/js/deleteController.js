"use strict";
import { getDataAll, deleteData } from "./crud";

const dataTable = document.querySelector(".table__1");
const deleteDataBtn = document.querySelector(".delete__data");

const url = "http://localhost:5000";

//  ** Functions

function availableData() {
  getDataAll(url, "dataone", dataTable);
}

// ** Event Listeners

deleteDataBtn.addEventListener("click", () => {
  try {
    const identifier = document.querySelector(".identifier__value").value;
    if (!identifier || identifier.length < 8) {
      alert("Tolong Masukkan Input Data Dengan Benar");
    } else {
      deleteData(url, identifier);
    }
  } catch (error) {
    console.log(error);
  }
});

function start() {
  availableData();
}

start();
