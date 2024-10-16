const { Router } = require("express");
const membersController = require("../controllers/membersController")
const membersRouter = Router();

membersRouter.get("/", membersController.membersGet)
membersRouter.get("/sign-up", membersController.membersSignUpGet)
membersRouter.post("/sign-up", membersController.membersSignUpPost)
membersRouter.post("/log-in")
membersRouter.get("/log-out", membersController.membersLogOut)

module.exports = membersRouter;