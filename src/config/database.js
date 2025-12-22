const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://sainigauravkumar186_db_user:ZGDcmxQqcd6rzadW@namsatenodejs.yrfv2ld.mongodb.net/devtender"
  );
};

module.exports = connectDB;
