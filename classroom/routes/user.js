const express = require("express")
const router = express.Router()

// index route
router.get("/",(req,res)=>{
    res.send("we Get the All users")
})

// show route
router.get("/:id",(req,res)=>{
    res.send("we Get the All users Id")
})

// Post Route
router.post("/",(req,res)=>{
    res.send("post for users")
})

// delete route
router.delete("/delete",(req,res)=>{
    res.send("we Delete the All users")
})

module.exports = router