const express = require("express")
const prisma = require("../lib/prisma")

const router = express.Router()

const bcrypt = require("bcrypt")
const saltRounds = 10


const jwt = require("jsonwebtoken")
const authMiddleware = require("../middleware/authMiddleware")
const { schemaRegister, schemaUpdate } = require("../schemas/userSchema")





router.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body
        const result = schemaRegister.safeParse({ name, email, password })
        if (!result.success) {
            return res.status(400).json({ error: "Validation failed" })
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
        console.log(err)
        return res.status(500).json({ error: "Internal Server Error" })
    }
})

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await prisma.user.findUnique({
            where: { email }
        })
        if (!user) return res.status(400).json({ error: "email or password is incorrect" })
        const isValid = await bcrypt.compare(password, user.password)
        if (!isValid) return res.status(400).json({ error: "email or password is incorrect" })
        const secret = process.env.JWT_SECRET
        const payload = { userId: user.id, name: user.name, email: user.email }
        const token = jwt.sign(payload, secret, { expiresIn: '1h' })
        res.status(200).json({ message: "successful login", accessToken: token })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ error: "Internal Server Error" })

    }
})

router.patch("/", authMiddleware, async (req, res) => {
    try {
        const { name, email, password } = req.body
        const data = {}
        const result = schemaUpdate.safeParse({ name, email, password })
        if (!result.success) {
            return res.status(400).json({ error: "Validation failed" })
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
        console.log(err)
        return res.status(500).json({ error: "Internal Server Error" })
    }
})


router.delete("/", authMiddleware, async (req, res) => {
    try {
        await prisma.user.delete({ where: { id: req.user.id } })
        return res.status(200).json({ message: "User deleted successfully" })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ error: "Internal Server Error" })
    }
})

module.exports = router

