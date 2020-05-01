const bodyParser = require("body-parser");
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const postsRoutes = require("./routes/posts");
const userRoutes = require("./routes/user");

const app = express();

// Created EIP: 13.233.240.123
// 'cPWFBJUKOoLoGcoX' // google-cloud
// 'lEyAUZKRz1yjCZ3R' // aws
// 1def8607366eac3430f4a7412fa3d242 // logDNA
mongoose
  .connect(
    `mongodb+srv://chad:${process.env.MONGO_ATLAS_PW}@cluster0-4ci3v.mongodb.net/node-angular`
  )
  .then(() => {
    console.log("Connected to the database");
  })
  .catch((e) => {
    console.log("Connection failed!");
    console.error(e)
  });

// INFO: this middleware is to extract and parse the request payload
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

// INFO: this middleware build in the express
app.use("/images", express.static(path.join("images")));

// INFO: for integrated app
// app.use("/", express.static(path.join(__dirname, "angular")));

// INFO: this middleware is to fix CORS error
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  next();
});

// INFO:
//   - this is how we can segregate the routes
//   - first args also make sure where to redirect
app.use("/api/posts", postsRoutes);
app.use("/api/user", userRoutes);

// INFO: for integrated app
// app.use((req, res, next) => {
//   res.sendFile(path.join(__dirname, "angular", "index.html"))
// })

module.exports = app;
