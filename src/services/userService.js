
const { InvalidCredentialsError } = require("../error/AppError")
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

async function login(email, password) {
    const userData = await prisma.user.findUnique({
        where: { email: email }
    })
    if (!userData) {
        throw new InvalidCredentialsError()
    }
    const isValid = await bcrypt.compare(password, userData.password)
    if (!isValid) {
        throw new InvalidCredentialsError()
    }
    return {
        id: userData.id,
        name: userData.name,
        email: userData.email
    }
}

async function update(userId, data) {
    await prisma.user.update({ where: { id: userId }, data })
}

async function deleted(userId) {
    await prisma.user.delete({ where: { id: userId } })
}
module.exports = { register, login, update, deleted }