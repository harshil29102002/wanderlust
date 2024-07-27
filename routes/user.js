const express = require("express");
const passport = require("passport");
const { SaveUrlredirect } = require("../middleware.js");
const router = express.Router();
const wrapAsync = require("../utils/utils");
const userController = require("../controller/user.js")

// router.get("/signup",userController.RenderSignupform);

// using router.route
router.route( "/signup")
.get(userController.RenderSignupform)
.post(wrapAsync(userController.signup));

// router.post(
//   "/signup",
//   wrapAsync(userController.signup)
// );

router.route("/login")
.get(userController.renderloginForm)
.post(SaveUrlredirect,passport.authenticate("local", {failureRedirect: "/login",failureFlash: true,}),userController.login);

// router.get("/login",userController.renderloginForm);

// router.post(
//   "/login",
//   SaveUrlredirect,
//   passport.authenticate("local", {
//     failureRedirect: "/login",
//     failureFlash: true,
//   }),
//   userController.login
// );

router.get("/logout",userController.logout)


module.exports = router;
