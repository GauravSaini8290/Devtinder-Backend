const jwt = require("jsonwebtoken")
const UserModel = require("../models/user")
const userAuth = async (req, res, next) => {
    try {

        //read the token req.cookies
        const { token } = req.cookies;
        if (!token) {
            throw new Error("token is not valide")
        }
        const decodedMassege = await jwt.verify(token, "DEV@TENDER1234")
        const { _id } = decodedMassege
        const user = await UserModel.findById(_id)
        if (!user) {
            throw new Error(" user not find")
        }
        req.user = user
        next()

    }
    catch (err) {
        res.status(401).send(" something worng  " + err.message)
    }

}

module.exports = { userAuth }