const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const path = require("path");
require("dotenv").config();
const connectDB = require("./db/dbConfig");
const checkJWT = require('./utils/checkJWT');

// Connect to database
connectDB();

// Import routes
const getRoutes = require("./routes/getRoutes");
const authRoutes = require("./routes/authRoutes");
const todoRoutes = require("./routes/todoRoutes");

// app.use
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(checkJWT);

// Routes
app.use("/", getRoutes); 
app.use("/auth", authRoutes);
app.use("/todos", todoRoutes); 

// port
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Running on port http://localhost:${PORT}`);
});