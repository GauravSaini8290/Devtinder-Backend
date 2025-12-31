const mongoose = require("mongoose");
const validator = require("validator")
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 4,
      maxLength: 15,
    },
    lastName: {
      type: String,

    },
    emailId: {
      type: String,
      uppercase: true,
      required: true,
      unique: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("invalid.. email" + value)
        }
      }
    },
    gender: {
      type: String,
      enum:{
        values :["female" ,"male" , "other"],
        message : `{values} worng gender`
      }
    },
    password: {
      type: String,
      required: true,
      unique: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("pleasee... enter the strong password " + value)
        }
      }
    },
    age: {
      type: Number,
      min: 18,
    },
    photoUrl: {
      type: String,
      default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR7VxDe4wzr6eLzRrpRXsqUl1pgSst3Q1XytA&s",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("invalid.. URL" + value)
        }
      }
    },
    skills: {
      type: [String]
    },
    about: {
      type: String,
      default: "this is the default value"
    }
  },
  {
    timestamps: true,
  }
);

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;
