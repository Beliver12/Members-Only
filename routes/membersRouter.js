const { Router } = require("express");
const membersController = require("../controllers/membersController")
const membersRouter = Router();

membersRouter.get("/", membersController.membersGet)
membersRouter.get("/sign-up", membersController.membersSignUpGet)
membersRouter.post("/sign-up", membersController.membersSignUpPost)

membersRouter.get("/log-out", membersController.membersLogOut)
membersRouter.get("/member-join", membersController.membersJoinGet)
membersRouter.post('/member-join', membersController.memberJoinPost)
membersRouter.get("/create-message", membersController.memberCreateMessageGet)
membersRouter.post("/create-message", membersController.memberCreateMessagePost)
membersRouter.get("/messages", membersController.memberMessagesGet)
membersRouter.post("/messages", membersController.memberMessagesPost)
membersRouter.get("/admin-join", membersController.adminJoinGet)
membersRouter.post("/admin-join", membersController.adminJoinPost)
membersRouter.post("/delete/:id", membersController.messageDeletePost)


module.exports = membersRouter;