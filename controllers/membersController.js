const membersStorage = require("../db/pool")
const bcrypt = require('bcrypt');
const { body, validationResult } = require("express-validator");

const passwordErr = "Passwords dont match!"

const validatePassword = [
  body('confirmPassword').custom((value, {req}) => {
    return value === req.body.password;
  }).withMessage(`${passwordErr}`)
]

exports.membersGet = async (req, res) => {
    const test = await membersStorage.query("SELECT * FROM users")
    console.log(test)
    res.render("index", { user: req.user });
}

exports.membersSignUpGet = (req, res) => {
    res.render("sign-up-form")
}

exports.membersSignUpPost = [ 
  validatePassword,
  async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
      return res.status(400).render("sign-up-form", {
        title: "Create movie",
        errors: errors.array(),
      });
    }
    bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
        if (err) {
          return next(err);
        }
       
        await membersStorage.query("INSERT INTO users (username, password) VALUES ($1, $2)", [
          req.body.username,
          hashedPassword,
        ])
        res.redirect("/");
  
      });
}]

exports.membersLogOut = (req, res, next) => {
    req.logout((err) => {
        if (err) {
          return next(err);
        }
        res.redirect("/");
      });
}