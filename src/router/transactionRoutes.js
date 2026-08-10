const express = require("express")
const authMiddleware = require("../middleware/authMiddleware")
const prisma = require("../lib/prisma")
const router = express.Router()

router.post("/", authMiddleware, async (req, res) => {
    const { description, type, amount } = req.body
    if (description === undefined) {
        return res.status(400).json({
            error: "Description is required"
        });
    }

    if (typeof description !== "string") {
        return res.status(400).json({
            error: "Description must be a string"
        });
    }

    if (description.trim() === "") {
        return res.status(400).json({
            error: "Description cannot be empty"
        });
    }

    if (type === undefined) {
        return res.status(400).json({
            error: "Type is required"
        });
    }

    if (type !== "INCOME" && type !== "EXPENSE") {
        return res.status(400).json({
            error: "Invalid transaction type"
        });
    }

    if (amount === undefined) {
        return res.status(400).json({
            error: "Amount is required"
        });
    }

    if (typeof amount !== "number" || !Number.isFinite(amount)) {
        return res.status(400).json({
            error: "Amount must be a valid number"
        });
    }

    if (amount <= 0) {
        return res.status(400).json({
            error: "Amount must be greater than zero"
        });
    }
    const transaction = await prisma.transaction.create({ data: { description, type, amount, userId: req.user.id } })
    return res.status(201).json(transaction)
})

module.exports = router