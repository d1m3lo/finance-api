const express = require("express")
const prisma = require("../lib/prisma")

const router = express.Router()

const bcrypt = require("bcrypt")
const saltRounds = 10


const jwt = require("jsonwebtoken")
const authMiddleware = require("../middleware/authMiddleware")
const { schemaUserUpdate, schemaUserRegister, schemaUserLogin } = require("../schemas/userSchema")
const userController = require("../controller/userController")





router.post("/register", userController.userRegister)

router.post("/login", userController.userLogin)

router.patch("/", authMiddleware, userController.userUpdate)


router.delete("/", authMiddleware, userController.userDelete)

module.exports = router

