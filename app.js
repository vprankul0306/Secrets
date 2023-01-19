const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
mongoose.set("strictQuery", false);
mongoose.connect("mongodb://127.0.0.1:27017/userDB", { useNewUrlParser: true });

const userSchema = {
  email: String,
  password: String,
};

const User = new mongoose.model("User", userSchema);

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/login", (req, res) => {
  res.render("login");
});
app.post("/login", (req, res) => {
  const email = req.body.username;
  const password = req.body.password;
  User.findOne({ email: email }, (err, user) => {
    if (err) {
      console.log(err);
    } else {
      if (user) {
        if (user.password === password) {
          res.render("secrets");
        } else {
          res.send("Please enter the correct password");
        }
      } else {
        res.send("User Not Found");
      }
    }
  });
});

app.get("/register", (req, res) => {
  res.render("register");
});
app.post("/register", (req, res) => {
  const email = req.body.username;
  const password = req.body.password;
  let newUser = new User({
    email: email,
    password: password,
  });
  newUser.save((err, result) => {
    if (err) console.log(err);
  });
  res.redirect("/");
});

app.get("*", (req, res) => {
  res.send("Page Not Found");
});

app.listen(3000, function () {
  console.log("Server stated on port 3000");
});
