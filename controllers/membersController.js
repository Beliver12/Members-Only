const membersStorage = require("../db/pool")
const bcrypt = require('bcrypt');
const { body, validationResult } = require("express-validator");

const passwordErr = "Passwords dont match!"


const validatePassword = [
  body('confirmPassword').custom((value, {req}) => {
    return value === req.body.password;
  }).withMessage(`${passwordErr}`)
]

const validateUsername = [
  body('username').custom(async value => {
    const user = await membersStorage.query("SELECT * FROM users WHERE username = $1", [value])
    if(user.rows.length > 0) {
      throw new Error('Username already in use');
    }
  })
]

const validateMember = [
  body('memberPassword').custom(async value => {
    const secretPass = 'strofa';
    if(secretPass !== value) {
      throw new Error('Wrong password.');
    }
  })
]

const validateAdmin = [
  body('adminPassword').custom(async value => {
    const secretPass = 'strofa1';
    if(secretPass !== value) {
      throw new Error('Wrong password.');
    }
  })
]

exports.membersGet = async (req, res) => {
   membersStorage.query("DELETE FROM users WHERE username = $1", ['Nikola4'])
   // const test = await membersStorage.query("SELECT * FROM users")
   // console.log(test)
    res.render("index", { user: req.user, messages: req.session.messages });
}



exports.membersSignUpGet = (req, res) => {
    res.render("sign-up-form")
}


exports.membersSignUpPost = [ 
  validatePassword,
  validateUsername,
  
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
       currentUser = req.body.username;
        await membersStorage.query("INSERT INTO users (username, password) VALUES ($1, $2)", [
          req.body.username,
          hashedPassword,
          
        ])
        res.render("index");
  
      });
}]

exports.membersJoinGet = (req, res) => {
  res.render("member-join")
}

exports.memberJoinPost =  [
  validateMember,
  async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
      return res.status(400).render("member-join", {
        title: "Create movie",
        errors: errors.array(),
      });
    }

  const secretPass = 'strofa';
  let status = 0;
  if(req.body.memberPassword === secretPass) {
        status = 1;
        req.user.rolestatus = status;
  } else {
    status = 0;
  }

  await membersStorage.query("UPDATE users SET rolestatus = $1 WHERE id = $2", [
    status,
    req.session.passport.user,
  ])
  res.render("index", { user: req.user });
}]

exports.memberCreateMessageGet = (req, res) => {
  res.render("create-message")
}

exports.memberCreateMessagePost = async (req, res, next) => {
  const date = new Date();

  await membersStorage.query("INSERT INTO usermessages (message, userid, date, username) VALUES ($1, $2, $3, $4)", [
    req.body.message,
    req.user.id,
    date,
    req.user.username,
  ])
  const messages  = await membersStorage.query("SELECT * FROM usermessages")
  res.redirect("/messages")
}

exports.memberMessagesGet = async (req, res) => {
   const messages = await membersStorage.query("SELECT * FROM usermessages")
  res.render("messages", {user: req.user, messages: messages.rows })
}

exports.memberMessagesPost = async (req, res) => {
  const messages = await membersStorage.query("SELECT * FROM usermessages")
 res.render("messages", {user: req.user, messages: messages.rows })
}

exports.adminJoinGet = (req, res) => {
  res.render("admin-join")
}

exports.adminJoinPost =  [
  validateAdmin,
  async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
      return res.status(400).render("admin-join", {
        title: "Create movie",
        errors: errors.array(),
      });
    }

  const secretPass = 'strofa1';
  let status = 0;
  if(req.body.adminPassword === secretPass) {
        status = 2;
        req.user.rolestatus = status;
  } else {
    status = 0;
  }

  await membersStorage.query("UPDATE users SET rolestatus = $1 WHERE id = $2", [
    status,
    req.session.passport.user,
  ])
  res.render("index", { user: req.user });
}]

exports.messageDeletePost = async (req, res) => {
  await membersStorage.query("DELETE FROM usermessages WHERE id = $1", [req.params.id])
  res.redirect("/messages")
}



exports.membersLogOut = (req, res, next) => {
    req.logout((err) => {
        if (err) {
          return next(err);
        }
        res.redirect("/");
      });
}