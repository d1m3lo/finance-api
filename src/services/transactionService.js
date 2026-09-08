const prisma = require("../lib/prisma")

async function createTransaction(description, type, amount, userId) {
    const transaction = await prisma.transaction.create({
        data: {
            description,
            type,
            amount,
            userId,
        }
    })
    return transaction
}

module.exports = {createTransaction}