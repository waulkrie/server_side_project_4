import passport from "passport";
import mongoose from "mongoose";
import User from "../models/user.js";

const login = {
  // get the register page
  getRegister: (req, res) => {
    res.render("register");
  },

  // process the register form
  postRegister: (req, res) => {
    console.log(req.body);
    const username = req.body.username;
    const password = req.body.password;
    const confirm_password = req.body.confirm_password;

    // Check if password and confirm password match
    if (password !== confirm_password) {
      req.session.flash = {
        type: "danger",
        intro: "Report Logged",
        message: "Your registration failed: Passwords do not match",
      };
      console.log("WTF");
      return res.render("register");
    }

    // if successful, login user and redirect to the main page
    User.register(new User({ username: username }), password, async (err, user) => {
      if (err) {
        console.log("registering fail " + err);
        req.session.flash = {
          type: "danger",
          intro: "Report Logged",
          message: "Your registration failed:" + err.code,
        };
        return res.render("register");
      } else {
        console.log("registered user..logging in..");
        user.save();
        passport.authenticate("local")(req, res, () => {
          console.log("User registered: " + user);
          req.session.flash = {
            type: "info",
            intro: "Report Logged",
            message: "Your registration was successful",
          };
          req.session.user = user;
          res.redirect("/");
        });
      }
    });
  },

  // get the login page
  getLogin: (req, res) => {
    res.render("login");
  },

  // process the login form
  postLogin: async (req, res) => {
    console.log("postLogin :");
    console.log(req.body);
    req.session.user = await User.findByUsername(req.body.username);
    res.redirect("/");
  },

  // logout user and redirect to the main page
  procLogout: (req, res) => {
    console.log(req.body);
    if (req.session && req.session.user) {
      delete req.session.user;

      req.session.flash = {
        type: "success",
        intro: "Logged out",
        message: "You have been logged out!",
      };
    }
    res.redirect("/");
  },
};

export default login;
