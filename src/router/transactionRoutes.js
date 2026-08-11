const express = require("express")
const authMiddleware = require("../middleware/authMiddleware")
const prisma = require("../lib/prisma")
const { schemaTransactionRegister } = require("../schemas/transactionSchema")
const router = express.Router()

router.post("/", authMiddleware, async (req, res) => {
    const { description, type, amount } = req.body
    const result = schemaTransactionRegister.safeParse({ description, type, amount })
    if (!result.success) {
        return res.status(400).json({ error: "Validation failed" })
    }
    const transaction = await prisma.transaction.create({
        data:
        {
            description: result.data.description,
            type: result.data.type,
            amount: result.data.amount,
            userId: req.user.id
        }
    })
    return res.status(201).json(transaction)
})

module.exports = router