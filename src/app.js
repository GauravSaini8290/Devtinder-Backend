const express = require("express");
const app = express();
const connectDB = require("./config/database");
const UserModel = require("./models/user");
const { validateSingupData } = require("./utils/validation")
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const { userAuth } = require("./middlewares/userAuth")
const jwt = require("jsonwebtoken")
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

app.post("/signup", async (req, res) => {
  try {
    //validation  of data
    validateSingupData(req)
    const { firstName, lastName, emailId, password } = req.body
    //create a new instance of the user 
    const passwordHash = await bcrypt.hash(password, 10)
    const user = new UserModel({
      firstName, lastName, emailId, password: passwordHash
    });
    await user.save();
    res.send("user added successfully ");
  } catch (err) {
    res.status(400).send("user not added" + err.message);
  }
});

//login 
app.post("/login", async (req, res) => {
  try {

    const { emailId, password } = req.body
    const user = await UserModel.findOne({ emailId: emailId })
    if (!user) {
      throw new Error("user not find")
    }
    const isPassswordValid = await bcrypt.compare(password, user.password)
    if (!isPassswordValid) {
      throw new Error("incorrect password")
    } else {

      //create JWT token
      const token = await jwt.sign({ _id: user._id }, "DEV@TENDER1234")
      res.cookie("token", token ,{ expires: new Date(Date.now() + 900000)})
      //the the token to cookie and send the response back to the user
      res.send("login successfully")
    }
  } catch (err) {
   res.status(404).send(" error ")
  }

})

//profile
app.get("/profile", userAuth, async (req, res) => {
  try {
    res.send(req.user)
  } catch (err) {
    res.status(404).send(" something worng" + err.massege)
  }
})

app.post("/connectionRequest", userAuth, (req, res) => {
  res.send(req.user.firstName + " send the request")
})

// get all the users from database
// app.post("/feed", async (req, res) => {
//   try {
//     // const Password = req.body.password;
//     const users = await UserModel.find({});
//     if (users.length === 0) {
//       throw new Error("no user");
//     } else {
//       res.send(users);
//     }
//   } catch (err) {
//     res.status(404).send("user not found");
//   }
// });
//user update from database
// app.patch("/user/:userId", async (req, res) => {
//   const userId = req.params?.userId
//   const data = req.body
//   try {
//     const ALLOW_KEYS = ["photoUrl", "about", "gender", "age", "skills"]
//     const ISUPDATE_ALLOWED = Object.keys(data).every((k) => ALLOW_KEYS.includes(k))
//     if (!ISUPDATE_ALLOWED) {
//       throw new Error("please check the object keys and try again......")
//     }
//     if (data?.skills.length > 10) {
//       throw new Error("invalide skills")
//     }
//     await UserModel.findByIdAndUpdate(userId, data)
//     res.send("user update")
//   } catch (err) {
//     res.status(404).send("not updated this object")
//   }
// })

//delete user from database
// app.delete("/user", async (req, res) => {
//   const userId = req.body.userId
//   await UserModel.findByIdAndDelete({ _id: userId })
//   res.send("delete user")
// })

connectDB()
  .then(() => {
    console.log("Database Connected");
    app.listen(7777, () => {
      console.log("server start");
    });
  })
  .catch((err) => {
    console.log("database connot be connected");
  });
