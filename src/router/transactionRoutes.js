const express = require("express")
const authMiddleware = require("../middleware/authMiddleware")
const prisma = require("../lib/prisma")
const { schemaTransactionRegister, schemaTransactionUpdate } = require("../schemas/transactionSchema")
const router = express.Router()

router.post("/", authMiddleware, async (req, res) => {
    try {
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
    } catch (err) {
        console.log(err)
        return res.status(500).json({ error: "Internal Server Error" })
    }
})

router.get("/", authMiddleware, async (req, res) => {
    try {
        const transactions = await prisma.transaction.findMany({
            where: { userId: req.user.id }
        })
        return res.status(200).json(transactions)
    } catch (err) {
        console.log(err)
        return res.status(500).json({ error: "Internal Server Error" })
    }
})

router.get("/:id", authMiddleware, async (req, res) => {
    try {
        const transactionId = req.params.id
        const transaction = await prisma.transaction.findUnique({
            where: { id: transactionId }
        })
        if (!transaction) return res.status(404).json({ error: "Transaction not found" })
        if (transaction.userId !== req.user.id) return res.status(404).json({ error: "Transaction not found" })
        return res.status(200).json(transaction)
    } catch (err) {
        console.log(err)
        return res.status(500).json({ error: "Internal Server Error" })
    }
})

router.patch("/:id", authMiddleware, async (req, res) => {
    try {
        const transactionId = req.params.id
        const transaction = await prisma.transaction.findUnique({ where: { id: transactionId } })
        if (!transaction) return res.status(404).json({ error: "Transaction not found" })
        if (transaction.userId !== req.user.id) return res.status(404).json({ error: "Transaction not found" })
        const { description, type, amount } = req.body
        const data = {}
        const result = schemaTransactionUpdate.safeParse({ description, type, amount })
        if (!result.success) {
            return res.status(400).json({ error: "Validation failed" })
        }
        if (description !== undefined) {
            data.description = result.data.description
        }
        if (type !== undefined) {
            data.type = result.data.type
        }
        if (amount !== undefined) {
            data.amount = result.data.amount
        }
        if (Object.keys(data).length === 0) return res.status(400).json({ error: "Missing fields" })
        await prisma.transaction.update({ where: { id: transaction.id }, data })
        return res.status(200).json({ message: "your transaction has been updated successfully" })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ error: "Internal Server Error" })
    }
})
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const transactionId = req.params.id
        const transaction = await prisma.transaction.findUnique({ where: { id: transactionId } })
        if (!transaction) return res.status(404).json({ error: "Transaction not found" })
        if (transaction.userId !== req.user.id) return res.status(404).json({ error: "Transaction not found" })
        await prisma.transaction.delete({ where: { id: transaction.id } })
        return res.status(200).json({ message: "Transaction deleted successfully" })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ error: "Internal Server Error" })
    }
})



module.exports = router