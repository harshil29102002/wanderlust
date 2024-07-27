const express = require("express")
const app = express()
const users = require("./routes/user.js")
const posts = require("./routes/posts.js")
// const cookieParser = require("cookie-parser")
const session = require("express-session")
const flash = require("connect-flash")
const path = require("path")

app.set("view engine","ejs")
app.set("views" , path.join(__dirname,"views"))

// app.use(cookieParser("secretcode"))
const sesseionOptions = {
    secret:"secretCode",
    resave:false,
    saveUninitialized:true
}
app.use(session(sesseionOptions))
app.use(flash());

app.get("/register",(req,res)=>{
    let {name="anonymous"} = req.query
    req.session.name = name
    if(name === "anonymous"){
        req.flash("error","user is not regisered")
    }else{
        req.flash("success","user is registered successfully")
    
    }
   
    console.log(name)
    res.redirect("/hello")
})

app.get("/hello",(req,res)=>{  
    res.locals.successmsg = req.flash("success")
    res.locals.errorMsg = req.flash("error")
  res.render("index.ejs",{name:req.session.name,})
})

// app.get("/get" ,(req,res)=>{
//     if(req.session.count){
//         req.session.count++
//     }else{
//         req.session.count = 1
//     }
//     res.send(`you have count ${req.session.count} times`)
// })


// app.get("/getsignedcookies",(req,res)=>{
//     res.cookie("greet","namaste",{signed:true})
//     res.send("there is cookie")
// })

// app.get("/verify",(req,res)=>{
//     console.log(req.signedCookies)
//     res.send("verified")
// })

// app.get("/getcookies",(req,res)=>{
//     res.cookie("greet","namaste")
//     res.cookie("madiIn","INDIA")
//     res.send("there is cookie")
// })

// app.get("/greet",(req,res)=>{
//     let {name = "anonymous"} = req.cookies
//     res.send(`hi,${name}`)
// })

// app.get("/",(req,res)=>{
//     console.dir(req.cookies)
//     res.send("we will on the root")
// })


// app.use("/users",users)
// app.use("/posts",posts)

app.listen(3000,()=>{
    console.log("port is listening on port 3000")
})