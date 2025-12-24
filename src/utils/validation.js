const validator = require("validator")

const validateSingupData = (req) => {
    const { firstName, lastName, emailId, password } = req.body
    if (!firstName || !lastName) {
        throw new Error(" name is not Correct")
    } else if (firstName.length < 4 || firstName.length > 50) {
        throw new Error(" name length not correct")
    } else if (!validator.isEmail(emailId)) {
        throw new Error(" email is not validate")
    } else if (!validator.isStrongPassword(password)) {
        throw new error(" password is not validate")
    }
}

const validateEditProfileData = (req) => {

    const allowedEditFields = ["firstName", "lastName", "photoUrl", "gender", "age", "about"]

    const isEditAllowed = Object.keys(req.body).every(field => allowedEditFields.includes(field))
    return isEditAllowed
}
module.exports = { validateSingupData, validateEditProfileData, }    