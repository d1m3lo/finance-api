const express = require("express")
const prisma = require("../lib/prisma")
const router = express.Router()
const bcrypt = require("bcrypt")
const saltRounds = 10

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
        const existingEmail = await prisma.user.findUnique({
            where: { email }
        })
        if (existingEmail) {
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
        res.status(500).json({ message: "Internal Server Error" })
    }
})

module.exports = router

