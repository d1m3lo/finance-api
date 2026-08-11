const z = require("zod")

const schemaTransactionRegister = z.object({
    description: z.string().trim().min(1),
    type: z.enum(["INCOME", "EXPENSE"]),
    amount: z.number().positive()
})

const schemaTransactionUpdate = z.object({
    description: z.string().trim().min(1).optional(),
    type: z.enum(["INCOME", "EXPENSE"]).optional(),
    amount: z.number().positive().optional()
})


module.exports = { schemaTransactionRegister, schemaTransactionUpdate }