const prisma = require("../lib/prisma")
const { schemaTransactionRegister, schemaTransactionUpdate } = require("../schemas/transactionSchema")

async function transactionCreate(req, res, next) {
    try {
        const { description, type, amount } = req.body
        const result = schemaTransactionRegister.safeParse({ description, type, amount })
        if (!result.success) {
            const errors = result.error.issues.map((issue) => ({
                field: issue.path[0],
                message: issue.message
            }))
            return res.status(400).json({ error: "Validation failed", errors })
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
        next(err)
    }
}

async function transactionGet(req, res, next) {
    try {
        const transactions = await prisma.transaction.findMany({
            where: { userId: req.user.id }
        })
        return res.status(200).json(transactions)
    } catch (err) {
        next(err)
    }
}

async function transactionGetById(req, res, next) {
    try {
        const transactionId = req.params.id
        const transaction = await prisma.transaction.findUnique({
            where: { id: transactionId }
        })
        if (!transaction) return res.status(404).json({ error: "Transaction not found" })
        if (transaction.userId !== req.user.id) return res.status(404).json({ error: "Transaction not found" })
        return res.status(200).json(transaction)
    } catch (err) {
        next(err)
    }
}

async function transactionUpdateById(req, res, next) {
    try {
        const transactionId = req.params.id
        const transaction = await prisma.transaction.findUnique({ where: { id: transactionId } })
        if (!transaction) return res.status(404).json({ error: "Transaction not found" })
        if (transaction.userId !== req.user.id) return res.status(404).json({ error: "Transaction not found" })
        const { description, type, amount } = req.body
        const data = {}
        const result = schemaTransactionUpdate.safeParse({ description, type, amount })
        if (!result.success) {
            const errors = result.error.issues.map((issue) => ({
                field: issue.path[0],
                message: issue.message
            }))
            return res.status(400).json({ error: "Validation failed", errors })
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
        next(err)
    }
}

async function transactionDeleteById(req, res, next) {
    try {
        const transactionId = req.params.id
        const transaction = await prisma.transaction.findUnique({ where: { id: transactionId } })
        if (!transaction) return res.status(404).json({ error: "Transaction not found" })
        if (transaction.userId !== req.user.id) return res.status(404).json({ error: "Transaction not found" })
        await prisma.transaction.delete({ where: { id: transaction.id } })
        return res.status(200).json({ message: "Transaction deleted successfully" })
    } catch (err) {
        next(err)
    }
}

module.exports = { transactionCreate, transactionGet, transactionGetById, transactionUpdateById, transactionDeleteById }