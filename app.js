require('dotenv').config()
const bcrypt = require('bcrypt');


const { Pool } = require("pg");
const express = require("express");
const path = require("node:path");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;

const assetsPath = path.join(__dirname, "public");


const pool = new Pool({
    connectionString: process.env.CONNECTION_STRING
});



const app = express();
const session = require('express-session')
const MemoryStore = require('memorystore')(session)
const membersRouter = require("./routes/membersRouter")
app.use(express.static(assetsPath));
app.set("views", __dirname + '/views');
app.set("view engine", "ejs");

app.use(session({ secret: "cats", resave: false, saveUninitialized: false,  
                     cookie: {
                      maxAge: 1000 * 60 * 60 * 24
                     }, store: new MemoryStore({
                      checkPeriod: 1000 * 60 * 60 * 24
                     }), }));
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));
app.use("/", membersRouter);

    passport.use(
        new LocalStrategy(async (username, password, done) => {
          
          try {
            const { rows } = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
            const user = rows[0];
      
            if (!user) {
              return done(null, false, { message: "Incorrect username" });
            }
            const match = await bcrypt.compare(password, user.password);
            if (!match) {
              // passwords do not match!
              return done(null, false, { message: "Incorrect password" })
            }
            return done(null, user);
          } catch(err) {
            
            return done(err);
          }
        })
      );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  
  passport.deserializeUser(async (id, done) => {
    
    try {
      const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
      const user = rows[0];
      
      done(null, user);
    } catch(err) {
      done(err);
    }
  });
  
  app.post(
    "/log-in",
   
    passport.authenticate("local", {
      successRedirect: "/",
      failureRedirect: "/",
      failureMessage: "Incorrect password or username"
    })
  ); 

  
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Express app listening on port ${PORT}!`));
