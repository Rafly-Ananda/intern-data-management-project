if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const router = express.Router();
const pool = require("../database");
const path = require("path");
const passport = require("passport");
const initializePassport = require("../passport-config");
const flash = require("express-flash");
const session = require("express-session");

initializePassport(passport);

// Middlewares
router.use(express.urlencoded({ extended: false }));
router.use(flash());
router.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
router.use(passport.initialize());
router.use(passport.session());

// ** GET REQUEST

router.get("/", checkIsAuthenticated, (req, res) => {
  res.sendFile(
    path.join(__dirname + "../../../client/public/views/uploadData.html")
  );
});

router.get("/login", checkNotAuthenticated, (req, res) => {
  res.sendFile(
    path.join(__dirname + "../../../client/public/views/login.html")
  );
});

router.get("/logout", (req, res) => {
  req.logOut();
  res.redirect("/login");
});

router.get("/upload", checkIsAuthenticated, (req, res) => {
  res.sendFile(
    path.join(__dirname + "../../../client/public/views/uploadData.html")
  );
});

router.get("/view", checkIsAuthenticated, (req, res) => {
  res.sendFile(
    path.join(__dirname + "../../../client/public/views/viewData.html")
  );
});

router.get("/delete", checkIsAuthenticated, isAdmin, (req, res) => {
  res.sendFile(
    path.join(__dirname + "../../../client/public/views/deleteData.html")
  );
});

// ** POST REQUEST

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

// ** CRUD API ** //

// ? CREATE
router.post(
  "/upload/:database/:identifier",
  checkIsAuthenticated,
  async (req, res) => {
    try {
      const info = req.body;
      const { database, identifier } = req.params;
      const newData = await pool.query(
        `INSERT INTO ${database} (identifier, info) VALUES ($1, $2) RETURNING *`, // returning is a callback function to read the data that was inserted
        [identifier, JSON.stringify(info)]
      );
      res.json(newData); // to return only the data
    } catch (err) {
      console.log(err.message);
    }
  }
);

// ? READ (ALL)
router.get("/view/:database/info", checkIsAuthenticated, async (req, res) => {
  try {
    const { database } = req.params;
    const getAllInfo = await pool.query(`SELECT * FROM ${database}`);
    res.json(
      getAllInfo.rows.map((identifier) => {
        return identifier.identifier;
      })
    );
  } catch (error) {
    console.log(error.message);
  }
});

// ? READ (SPECIFIC)
router.get(
  "/view/:database/info/:identifier",
  checkIsAuthenticated,
  async (req, res) => {
    const { database, identifier } = req.params;
    try {
      const data = await pool.query(
        `SELECT * FROM ${database} WHERE identifier = $1`,
        [identifier]
      );

      !data.rows[0] ? res.json(`Data doesn't exist!`) : res.json(data.rows[0]);
    } catch (error) {
      console.log(error.message);
    }
  }
);

// ? DELETE
router.delete(
  "/delete/:identifier",
  checkIsAuthenticated,
  isAdmin,
  async (req, res) => {
    const { identifier } = req.params;
    try {
      const data__1 = await pool.query(
        `DELETE FROM dataone WHERE identifier = $1 RETURNING *`,
        [identifier]
      );
      const data__2 = await pool.query(
        `DELETE FROM datatwo WHERE identifier = $1 RETURNING *`,
        [identifier]
      );
      const data__3 = await pool.query(
        `DELETE FROM datathree WHERE identifier = $1 RETURNING *`,
        [identifier]
      );
      const data__4 = await pool.query(
        `DELETE FROM datafour WHERE identifier = $1 RETURNING *`,
        [identifier]
      );
      res.json("Data Deleted");
    } catch (error) {
      console.log(error.message);
    }
  }
);

// ** AuthChecker__Middleware ** //

// req.user => will return id username and password

function checkIsAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
  next();
}

function isAdmin(req, res, next) {
  if (req.user.roles !== "admin") {
    res.status(403);
    return res.send("Error, you are not admin");
  }
  next();
}

module.exports = router;
