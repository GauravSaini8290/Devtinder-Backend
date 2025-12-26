const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/userAuth");
const ConnectionRequest = require("../models/connection");
const UserModel = require("../models/user");

requestRouter.post("/request/send/:status/:reciverId",
    userAuth,
    async (req, res) => {
        try {
            const senderId = req.user._id;
            const reciverId = req.params.reciverId;
            const status = req.params.status;
            const allowedStatus = ["interested", "ignore"];

            if (!allowedStatus.includes(status)) {
                throw new Error(" Incorrect status");
            }
            const reciver = await UserModel.findById(reciverId);
            if (!reciver) {
                throw new Error(" user not present here");
            }
            if (senderId.toString() === reciverId) {
                throw new Error("You cannot send request to yourself");
            }
            // if there is an existing connectionRequest
            const existingConnectionRequest = await ConnectionRequest.findOne({
                $or: [
                    { senderId, reciverId },
                    { senderId: reciverId, reciverId: senderId },
                ],
            });
            if (existingConnectionRequest) {
                throw new Error(" request already sent ");
            }

            const connections = new ConnectionRequest({
                senderId,
                reciverId,
                status,
            });
            const data = await connections.save();
            res.json({
                message:
                    req.user.firstName + " is" + status + " in" + reciver.firstName,
                data,
            });
        } catch (err) {
            res.status(400).send(err.message);
        }
    }
);

requestRouter.post("/request/review/:status/:requestId", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user
        const status = req.params.status
        const requestId = req.params.requestId

        const allowedStatus = ["accepted", "rejected"];
        if (!allowedStatus.includes(status)) {
            throw new Error("invalide status")
        }
        const connectionRequest = await ConnectionRequest.findOne({
            _id: requestId,
            status: "interested",
            reciverId: loggedInUser._id
        })
        if (!connectionRequest) {
            throw new Error("invalide request")
        }
        connectionRequest.status = status

        const data = await connectionRequest.save()
        res.json({
            data,
            message: "connection request" + status
        })
    } catch (err) {
        res.status(404).send("ERROR: " + err.message)
    }
})
module.exports = requestRouter;
