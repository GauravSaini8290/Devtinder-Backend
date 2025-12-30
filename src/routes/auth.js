const express = require("express")
const authRouter = express.Router()
const { validateSingupData } = require("../utils/validation")
const UserModel = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")

authRouter.post("/signup", async (req, res) => {
    try {
        //validation  of data
        validateSingupData(req)
        const { firstName, lastName, emailId, password } = req.body
        //create a new instance of the user 
        const passwordHash = await bcrypt.hash(password, 10)
        const user = new UserModel({
            firstName, lastName, emailId, password: passwordHash
        });
        await user.save();
        res.json({
            data: user,
            message: "signup successfulyyyyy"
        });
    } catch (err) {
        res.status(400).send(" user not added" + err.message);
    }
});

authRouter.post("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body
        const user = await UserModel.findOne({ emailId: emailId })
        if (!user) {
            throw new Error(" emailId is not correct")
        }
        const isPassswordValid = await bcrypt.compare(password, user.password)
        if (!isPassswordValid) {
            throw new Error("incorrect password")
        } else {

            //create JWT token
            const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" })
            res.cookie("token", token, { expires: new Date(Date.now() + 60 * 60 * 1000) })
            //the the token to cookie and send the response back to the user
            res.json({
                data: user,
                message: "login successfulyyyyy"
            });
        }
    } catch (err) {
        res.status(400).send("ERROR: " + err.message)
    }

})

authRouter.post("/logout", async (req, res) => {
    res.cookie("token", null, {
        expires: new Date(Date.now())
    })
    res.send("logout")
})

module.exports = authRouter