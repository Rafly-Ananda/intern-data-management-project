if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const cors = require("cors");

const PORT = process.env.PORT || 8080;
const corsOptions = {
  origin: "http://localhost:8080",
};

// Static
app.use(express.static("../client"));
app.use(express.static("../client/public"));

// Middlewares
app.use(express.json({ limit: "50mb" }));
app.use(cors(corsOptions));

const routes = require("./routes/routes");
app.use("/", routes);

app.listen(PORT, () => {
  console.log(`listening on port http://localhost:${PORT}`);
});
