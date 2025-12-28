const express = require("express");
const app = express();
const connectDB = require("./config/database");
const userRouter = require("./routes/user")
const cors = require("cors")
const cookieParser = require("cookie-parser");

app.use(cors({
  origin:"http://localhost:5173",
  credentials:true
}))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()) 


const authRouter = require("./routes/auth")
const profileRouter = require("./routes/profile")
const requestRouter = require("./routes/requests")

app.use("/" , authRouter)
app.use("/" , profileRouter)
app.use("/" , requestRouter)
app.use("/" ,userRouter)

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