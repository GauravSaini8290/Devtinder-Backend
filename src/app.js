const express = require("express");
const app = express();
const connectDB = require("./config/database");
const UserModel = require("./models/user");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.post("/signup", async (req, res) => {
  // console.log(req.body)
  const user = new UserModel(req.body);
  try {
    await user.save();
    res.send("user added successfully ");
  } catch (err) {
    res.status(400).send("user not added" + err.message);
  }
});

// get all the users from database
app.post("/feed", async (req, res) => {
  try {
    // const Password = req.body.password;
    const users = await UserModel.find({});
    if (users.length === 0) {
      throw new console.error("no user");
    } else {
      res.send(users);
    }
  } catch (err) {
    res.status(404).send("user not found");
  }
});
//user update from database
app.patch("/user", async (req, res) => {
  const userId = req.body.userId
  const data = req.body
  await UserModel.findByIdAndUpdate({ _id: userId }, data)
  res.send("user update")
})

//delete user from database
app.delete("/user", async (req, res) => {
  const userId = req.body.userId
  await UserModel.findByIdAndDelete({ _id: userId })
  res.send("delete user")
})

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
