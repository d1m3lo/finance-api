const express = require("express")
const router = express.Router()
const authMiddleware = require("../middleware/authMiddleware")
const transactionController = require("../controller/transactionController")

router.post("/", authMiddleware, transactionController.transactionCreate)

router.get("/", authMiddleware, transactionController.transactionGet)

router.get("/:id", authMiddleware, transactionController.transactionGetById)

router.patch("/:id", authMiddleware, transactionController.transactionUpdateById)

router.delete("/:id", authMiddleware, transactionController.transactionDeleteById)



module.exports = router