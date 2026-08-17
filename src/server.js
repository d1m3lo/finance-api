const express = require("express");
const userRoutes = require("./router/userRoutes");
const transactionRoutes = require("./router/transactionRoutes")
const authMiddleware = require("./middleware/authMiddleware");
const errorMiddleware = require("./middleware/errorMiddleware");
require("dotenv").config()
const app = express();

app.use(express.json())
app.use("/users", userRoutes)
app.use("/transactions", transactionRoutes)
app.use(errorMiddleware)

app.listen(3000, () => {
    console.log("Server running on port 3000");
});