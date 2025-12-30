const express = require("express")
const authRouter = express.Router()
const { validateSingupData } = require("../utils/validation")
const UserModel = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")

authRouter.post("/signup", async (req, res) => {
    try {
        // 1. Validate request body
        validateSingupData(req);

        const { firstName, lastName, emailId, password } = req.body;

        // 2. Check if user already exists
        const existingUser = await UserModel.findOne({ emailId });
        if (existingUser) {
            return res.status(400).json({ message: "Email already registered" });
        }

        // 3. Hash password
        const passwordHash = await bcrypt.hash(password, 10);

        // 4. Create user
        const user = new UserModel({
            firstName,
            lastName,
            emailId,
            password: passwordHash,
        });

        const savedUser = await user.save();

        // 5. Create JWT
        const token = jwt.sign(
            { _id: savedUser._id },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        // 6. Set secure cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60 * 1000, // 1 hour
        });

        // 7. Send response (NO PASSWORD)
        res.status(201).json({
            data: {
                _id: savedUser._id,
                firstName: savedUser.firstName,
                lastName: savedUser.lastName,
                emailId: savedUser.emailId,
            },
            message: "Signup successful",
        });
    } catch (err) {
        res.status(400).json({
            message: err.message || "User not added",
        });
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