const express = require("express")
const requestRouter = express.Router()
const { userAuth } = require("../middlewares/userAuth")


requestRouter.post("/connectionRequest", userAuth, (req, res) => {
    res.send(req.user.firstName + " send the request")
})
module.exports = requestRouter