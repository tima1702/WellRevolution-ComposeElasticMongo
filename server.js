const mongoose = require("mongoose");
const mongoosastic = require("mongoosastic");

mongoose.connect("mongodb://mongo01:27017");

var UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  city: String,
});

UserSchema.plugin(mongoosastic, {
  host: "es01",
  port: 9200,
});

var User = mongoose.model("user", UserSchema);

User.createMapping((err, mapping) => {
  console.log("mapping created");
});

setInterval(() => {
  const newUser = new User({
    name: "User",
    email: "user@gmail.com",
    city: "London",
  });

  newUser.save((err) => {
    if (err) {
      console.log(err);
    }
    console.log("user added in both the databases");
  });

  newUser.on("es-indexed", (err, result) => {
    console.log("indexed to elastic search");
  });
}, 10000);
