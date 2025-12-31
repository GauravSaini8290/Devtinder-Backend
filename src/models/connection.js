const mongoose = require("mongoose");
const conectionRequestSchema = new mongoose.Schema(
    {
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref:"User",
            required: true,
        },
        reciverId: {
            type: mongoose.Schema.Types.ObjectId,
            ref:"User",
            required: true,
        },
        status: {
            type: String,
            required: true,
            enum: {
                values: ["ignore", "interested", "accepted", "rejected"],
                message: `{values} is incorrect status type`,
            },
        },
    },
    {
        timestamps: true,
    }
);
const ConnectionRequest = new mongoose.model(
    "connectionRequest",
    conectionRequestSchema
);
module.exports = ConnectionRequest;
