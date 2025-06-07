// utils/cloudinaryUpload.js
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
require("dotenv").config();

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});

module.exports = function uploadToCloudinary(filePath) {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(filePath, { resource_type: "raw" }, (error, result) => {
            if (error) reject(error);
            else resolve(result.secure_url);
        });
    });
};
