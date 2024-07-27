const User = require("../models/user.js")


module.exports.RenderSignupform =  (req, res) => {
    res.render("./users/signup.ejs");
  }

  module.exports.signup = async (req, res) => {
    try {
      let { username, email, password } = req.body;
      let newUser = new User({ email, username });
      const registerUsr = await User.register(newUser, password);
      console.log(registerUsr);
      req.login(registerUsr,(err)=>{
        if(err){
         next(err)
        }
        req.flash("success", "welcome to the WanderLust !");
        res.redirect("/listings");
      })
    
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("/signup");
    }
  }

 module.exports.renderloginForm = (req, res) => {
    res.render("./users/login.ejs");
  }

  module.exports.login = async (req, res) => {
    req.flash("success", "welcome to the WanderLust !");
    let redirectUrl = res.locals.redirectUrl || "/listings"
    res.redirect(redirectUrl);
  }

  module.exports.logout = (req,res,next)=>{
    req.logout((err)=>{
    if(err){
      return next(err)
    }
    req.flash("success","you have loggedOut successfully")
    res.redirect("/listings")
    })
  }
  
  