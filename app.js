//jshint esversion:6
require('dotenv').config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption")

const app = express();
app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect("mongodb://localhost:27017/userDB", {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true
});

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});


userSchema.plugin(encrypt, { secret: process.env.secret , encryptedFields: ['password'] } );

const User = new mongoose.model("User", userSchema)

app.get("/", function(req,res){
  res.render("home");
});


app.route("/register")
.get(function(req,res){
  res.render("register");
})
.post(function(req, res){
  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  });
 //!!IMPORTANT LEVE-1: Saving the user data in the database and rendering the secrets.ejs page
  newUser.save(function(err){
    if(err){
      console.log(er);
    }else{
      res.render('secrets');
    }
  });
});

app.route("/login")
.get(function(req,res){
  res.render("login");
})
.post(function(req,res){
  const username =  req.body.username;
  const password =  req.body.password;
// Using find to check validity and data in the database
  User.findOne({email: username}, function(err, foundUser){
    if(err){
      console.log(err);
    }else{
      //!!IMPORTANT LEVEL 1: DOING THE CHECK
      if(foundUser){
        if(foundUser.password === password){
          console.log(foundUser.password);
          res.render("secrets");
        }
      }
    }
  });
});


app.listen(3000, function(){
  console.log("Server starting at port:3000");
});
