const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");

const app = express();
console.log('app js file');
mongoose
  .connect(
    "mongodb+srv://trofimserhii:" + process.env.MONGO_ATLAS_PW + "@cluster0.5aho0xz.mongodb.net/posts"
  )
  .then(() => console.log("Database connected"))
  .catch(() => console.log("Database does not connect"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/images", express.static(path.join(__dirname, "images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, PUT"
  );

  next();
});

const postRouter = require("./routes/posts");
const authRouter = require("./routes/user");
app.use("/api/posts", postRouter);
app.use("/api/user", authRouter);

app.listen(process.env.POST || 3000);
