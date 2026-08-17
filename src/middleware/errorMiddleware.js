function errorMiddleware(err, req, res, next) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === "P2002") {
            return res.status(409).json({
                error: "Resource already exists"
            })
        }
    }
    console.error(err)
    return res.status(500).json({ error: "Internal Server Error" })
}

module.exports = errorMiddleware