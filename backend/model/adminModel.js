const mongoose = require("mongoose");
const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "admin",
    },
    profilePic: {
        type: String,
        default: "default.jpg",
    },

});

const Admin = mongoose.model("Admin", adminSchema);
module.exports = Admin;