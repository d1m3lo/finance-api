const z = require("zod")

const schemaUserRegister = z.object({
    name: z.string().trim().min(1),
    email: z.string().trim().email(),
    password: z.string().min(8)
})

const schemaUserLogin = z.object({ 
    email: z.string().trim().email(),
    password: z.string()
})

const schemaUserUpdate = z.object({
    name: z.string().trim().min(1).optional(),
    email: z.string().trim().email().optional(),
    password: z.string().min(8).optional()
})

module.exports = { schemaUserRegister, schemaUserLogin, schemaUserUpdate }