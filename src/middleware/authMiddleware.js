const jwt = require("jsonwebtoken")
const prisma = require("../lib/prisma")

async function authMiddleware(req, res, next) {
    try {
        const authHeader = req.headers.authorization
        if (!authHeader) return res.status(401).json({ error: "Authorization header missing" })
        if (!authHeader.startsWith("Bearer ")) return res.status(401).json({ error: "Invalid authorization format. Expected 'Bearer <token>'." })
        const token = authHeader.split(' ')[1]
        const payload = jwt.verify(token, process.env.JWT_SECRET)
        const user = await prisma.user.findUnique({ where: { id: payload.userId } })
        req.user = user
        next()
    } catch (err) {
        console.log(err)
        return res.status(500).json({ error: "Internal Server Error" })
    }


}

module.exports = authMiddleware