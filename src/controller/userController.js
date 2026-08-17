const prisma = require("../lib/prisma")

const bcrypt = require("bcrypt")
const saltRounds = 10


const jwt = require("jsonwebtoken")
const { schemaUserUpdate, schemaUserRegister, schemaUserLogin } = require("../schemas/userSchema")



async function userRegister(req, res, next) {
    try {
        const { name, email, password } = req.body
        const result = schemaUserRegister.safeParse({ name, email, password })
        if (!result.success) {
            const errors = result.error.issues.map((issue) => ({
                field: issue.path[0],
                message: issue.message
            }))
            return res.status(400).json({ error: "Validation failed", errors })
        }
        const existingEmail = await prisma.user.findUnique({
            where: { email: result.data.email }
        })
        if (existingEmail) {
            return res.status(409).json({ error: "Email already registered" })
        }
        const hashPassword = await bcrypt.hash(result.data.password, saltRounds)
        await prisma.user.create({
            data: {
                name: result.data.name,
                email: result.data.email,
                password: hashPassword
            }
        })
        res.status(201).json({ name: result.data.name, email: result.data.email })
    } catch (err) {
        next(err)
    }
}

async function userLogin(req, res, next) {
    try {
        const { email, password } = req.body
        const result = schemaUserLogin.safeParse({ email, password })
        if (!result.success) {
            const errors = result.error.issues.map((issue) => ({
                field: issue.path[0],
                message: issue.message
            }))
            return res.status(400).json({ error: "Validation failed", errors })
        }
        const user = await prisma.user.findUnique({
            where: { email: result.data.email }
        })
        if (!user) return res.status(400).json({ error: "email or password is incorrect" })
        const isValid = await bcrypt.compare(result.data.password, user.password)
        if (!isValid) return res.status(400).json({ error: "email or password is incorrect" })
        const payload = { userId: user.id, name: user.name, email: user.email }
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' })
        res.status(200).json({ message: "successful login", accessToken: token })
    } catch (err) {
        next(err)
    }
}

async function userUpdate(req, res, next) {
    try {
        const { name, email, password } = req.body
        const data = {}
        const result = schemaUserUpdate.safeParse({ name, email, password })
        if (!result.success) {
            const errors = result.error.issues.map((issue) => ({
                field: issue.path[0],
                message: issue.message
            }))
            return res.status(400).json({ error: "Validation failed", errors })
        }
        if (name !== undefined) {
            data.name = result.data.name
        }
        if (email !== undefined) {
            const existingEmail = await prisma.user.findUnique({ where: { email: result.data.email } })
            if (existingEmail && existingEmail.id !== req.user.id) return res.status(409).json({ error: "Email already registered" })
            data.email = result.data.email
        }
        if (password !== undefined) {
            const hashPassword = await bcrypt.hash(result.data.password, saltRounds)
            data.password = hashPassword
        }
        if (Object.keys(data).length === 0) return res.status(400).json({ error: "Missing fields" })
        await prisma.user.update({ where: { id: req.user.id }, data })
        return res.status(200).json({ message: "your data has been updated successfully" })
    } catch (err) {
        next(err)
    }
}

async function userDelete(req, res, next) {
    try {
        await prisma.user.delete({ where: { id: req.user.id } })
        return res.status(200).json({ message: "User deleted successfully" })
    } catch (err) {
        next(err)
    }
}

module.exports = { userRegister, userLogin, userUpdate, userDelete }