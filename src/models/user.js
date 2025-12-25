const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

mongoose.set("strictQuery", false); // prevent mongoose hook errors

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true   // IMPORTANT → passport-local-mongoose needs this
    }
});

// plugin MUST come after schema definition
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
