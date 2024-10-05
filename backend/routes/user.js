const express = require("express");
const zod = require("zod");
const User = require("../db");
const jwt = require("jsonwebtoken");
const JWT_SECRET = require("../config");

const router = express.Router();

const signupschema = zod.object({
    userName : zod.string().email(),
    firstName : zod.string(),
    lastName : zod.string(),
    password: zod.string()
});

const singinschema = zod.object({
    userName: zod.string().email(),
    password: zod.string()
})

router.post("/signup", async (req, res) => {
    const response = signupschema.safeParse(req.body);

    if(!response.success){
        res.status(411).json({
            message: "Email already taken / Incorrect inputs"
        })
    }

    const user = await User.findOne({
        userName: req.body.userName
    })

    if(user._id){
        return res.json({
           message: "Email already taken / Incorrect inputs"
        })
    }
    const dbUser = await User.create(req.body);
    const token = jwt.sign({userId: dbUser._id}, JWT_SECRET);
    
    res.json({
        message: "User created successfully",
        token: token
    })


})

router.post("/signin", async (req, res) => {
    const response = singinschema.safeParse(req.body);
    if(!response.success){
        res.status(411).json({
            message: "Error while logging in"
        })
    }

    const user = await User.findOne(body);

    if(user){
        const token = jwt.sign({
            userId: user._id
        }, JWT_SECRET);

        return res.json({
            token: token
        })
    }

    res.status(411).json({
        message: "Error while logging in"
    })


})



module.exports = router; 