const { Prisma } = require("@prisma/client");

function errorMiddleware(err, req, res, next) {
    console.error(err)
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === "P2002") {
            return res.status(409).json({
                error: "Resource already exists"
            })
        }
        if (err.code === "P2025") {
            return res.status(404).json({ error: "Resource not found" })
        }
    }
    return res.status(500).json({ error: "Internal Server Error" })
}

module.exports = errorMiddleware