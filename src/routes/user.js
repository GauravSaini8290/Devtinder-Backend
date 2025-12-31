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
        const loggedInUser = req.user;
        const connectionRequests = await ConnectionRequest.find({
            $or: [
                { reciverId: loggedInUser._id, status: "accepted" },
                { senderId: loggedInUser._id, status: "accepted" }
            ],
        })
        // Make sure populate paths match the schema fields exactly
        .populate("senderId", "firstName lastName about photoUrl")
        .populate("reciverId", "firstName lastName about photoUrl");

        const data = connectionRequests.map((row) => {
            // Safety check: ensure populated objects exist
            if (!row.senderId || !row.reciverId) return null;

            // Check using toString() for reliable comparison
            if (row.senderId._id.toString() === loggedInUser._id.toString()) {
                return row.reciverId; // Return the other person (receiver)
            } else {
                return row.senderId; // Return the other person (sender)
            }
        }).filter(user => user !== null); // Filter out any null entries

        res.json({ data: data });
    } catch (err) {
        res.status(400).json({ message: "Server error: " + err.message });
    }
});



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