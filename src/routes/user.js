const express = require("express")
const userRouter = express.Router()

const { userAuth } = require("../middlewares/userAuth")
const ConnectionRequest = require("../models/connection")
const UserModel = require("../models/user")
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
    try {
        const logedInUser = req.user
        const connectionRequests = await ConnectionRequest.find({
            reciverId: logedInUser._id,
            status: "interested"
        }).populate("senderId", "firstName lastName about photoUrl")
        res.json({
            message: " data fetched ",
            data: connectionRequests
        })
    } catch (err) {
        res.status(401).send(err.message)
    }
})

userRouter.get("/user/connections", userAuth, async (req, res) => {
    try {
        const logedInUser = req.user
        const connectionRequests = await ConnectionRequest.find({
            $or: [
                {
                    reciverId: logedInUser._id, status: "accepted"
                },
                {
                    senderId: logedInUser._id, status: "accepted"
                }
            ]
        }).populate("senderId", "firstName lastName about photoUrl").populate("reciverId", "firstName lastName")
        const data = connectionRequests.map((row) => {
            if (row.senderId._id.toString() === logedInUser._id.toString()) {
                return row.reciverId
            } return row.senderId
        })
        res.json({
            data
        })
    } catch (err) {
        res.status(401).send(err.message)
    }

})

userRouter.get("/feed", userAuth, async (req, res) => {
    try {

        const loogedInUser = req.user
        const page = parseInt(req.query.page) || 1
        let limit = parseInt(req.query.limit) || 10
        limit = limit > 50 ? 50 : limit
        const skip = (page - 1) * limit
        const connectionRequests = await ConnectionRequest.find({
            $or: [{
                senderId: loogedInUser._id
            }, { reciverId: loogedInUser._id }]
        })
        const hideUsersFromFeed = new Set()
        connectionRequests.forEach((req) => {
            hideUsersFromFeed.add(req.senderId.toString())
            hideUsersFromFeed.add(req.reciverId.toString())

        })
        const users = await UserModel.find({
            $and: [
                { _id: { $nin: Array.from(hideUsersFromFeed) } },
                { _id: { $ne: loogedInUser._id } }
            ]
        }).select("firstName lastName photoUrl about gender age").skip(skip).limit(limit)
        res.json({ data: users })
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
})

module.exports = userRouter