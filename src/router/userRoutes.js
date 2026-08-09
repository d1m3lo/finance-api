const express = require("express")
const prisma = require("../lib/prisma")

const router = express.Router()

const bcrypt = require("bcrypt")
const saltRounds = 10


const jwt = require("jsonwebtoken")



router.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body
        const isEmpty = (value) => !value || (typeof value === "string" && value.trim() === "")
        const missingFields = []
        if (isEmpty(name)) missingFields.push(name)
        if (isEmpty(email)) missingFields.push(email)
        if (isEmpty(password)) missingFields.push(password)
        if (missingFields.length > 0) {
            return res.status(400).json({ error: "Missing required fields", fields: missingFields })
        }
        const user = await prisma.user.findUnique({
            where: { email }
        })
        if (user) {
            return res.status(409).json({ error: "Email already registered" })
        }
        const hashPassword = await bcrypt.hash(password, saltRounds)
        await prisma.user.create({
            data: {
                name,
                email,
                password: hashPassword
            }
        })
        res.status(201).json({ name, email })
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

module.exports = router

