
const prisma = require("../lib/prisma")
const bcrypt = require("bcrypt")
const saltRounds = 10

async function register(name, email, password) {
    const hashPassword = await bcrypt.hash(password, saltRounds)
    const userData = await prisma.user.create({
        data: {
            name: name,
            email: email,
            password: hashPassword
        }
    })
    return {
        name: userData.name,
        email: userData.email
    }
}
module.exports = { register }