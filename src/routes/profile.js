const express = require("express")
const profileRouter = express.Router()
const { userAuth } = require("../middlewares/userAuth")
const { validateEditProfileData } = require("../utils/validation")
profileRouter.get("/profile/view", userAuth, async (req, res) => {
    try {
        res.send(req.user)
    } catch (err) {
        res.status(404).send(" something worng" + err.massege)
    }
})

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {

    try {
        if (!validateEditProfileData(req)) {
            throw new Error("invalide edit request")
        }
        const loggedInUser = req.user;
        Object.keys(req.body).forEach((key) => loggedInUser[key] = req.body[key])
        await loggedInUser.save()
        res.send(loggedInUser.firstName + " your profile was updated")
    } catch (err) {
        res.status(404).send(err.message)
    }
})
module.exports = profileRouter