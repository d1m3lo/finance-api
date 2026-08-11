const z = require("zod")

const schemaTransactionRegister = z.object({
    description: z.string().trim().min(1),
    type: z.enum(["INCOME", "EXPENSE"]),
    amount: z.number().positive()
})


module.exports = { schemaTransactionRegister }