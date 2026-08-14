const express = require("express")


const router = express.Router()

//Middleware
const authMiddleware = require("../middleware/authMiddleware")

//Controller 
const userController = require("../controller/userController")





router.post("/register", userController.userRegister)

router.post("/login", userController.userLogin)

router.patch("/", authMiddleware, userController.userUpdate)


router.delete("/", authMiddleware, userController.userDelete)

module.exports = router

