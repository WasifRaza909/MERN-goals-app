const express = require("express");
const colors = require('colors')
const connectDB = require('./config/db')
const { errorHandler } = require("./middlewares/errorMiddleware");
const dotenv = require("dotenv").config()

const port = process.env.PORT || 5000

connectDB()

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use("/api/goals", require('./routes/goalRoutes'))
app.use("/api/users", require('./routes/userRoutes'))

app.use(errorHandler)


app.listen(port, () => console.log(`Server is started on port ${port}`))