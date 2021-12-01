const localStrategy = require("passport-local").Strategy;
const pool = require("./database");

function initialize(passport) {
  const authenticateUser = (username, password, done) => {
    pool.query(
      `select * from users where username = $1`,
      [username],
      (error, result) => {
        if (error) {
          console.log(error);
        }

        // Account Validation
        if (result.rows.length > 0) {
          const user = result.rows[0];
          if (password === user.password) {
            return done(null, user);
          } else {
            return done(null, false, console.log("wrong password"));
          }
        } else {
          return done(null, false, console.log(`user doesn't exist`));
        }
      }
    );
  };

  passport.use(
    new localStrategy(
      {
        usernameField: "username",
        passwordField: "password",
      },
      authenticateUser
    )
  );

  passport.serializeUser((user, done) => {
    return done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    pool.query(`select * from users where id = $1`, [id], (error, result) => {
      if (error) {
        console.log(error);
      } else {
        return done(null, result.rows[0]);
      }
    });
  });
}

module.exports = initialize;
