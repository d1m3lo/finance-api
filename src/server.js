const express = require("express");
const userRoutes = require("./router/userRoutes");
const authMiddleware = require("./middleware/authMiddleware");
require("dotenv").config()
const app = express();

app.use(express.json())
app.use("/", userRoutes)

app.listen(3000, () => {
    console.log("Server running on port 3000");
});