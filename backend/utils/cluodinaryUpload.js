// utils/cloudinaryUpload.js
const cloudinary = require("cloudinary").v2;
require("dotenv").config();

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});

/**
 * Uploads a buffer (like resume PDF) to Cloudinary as raw file
 * @param {Buffer} buffer - The resume file buffer (e.g., from multer.memoryStorage)
 * @param {string} folder - Optional folder name in Cloudinary
 * @returns {Promise<string>} - The secure URL of the uploaded file
 */
module.exports = function uploadToCloudinary(buffer, folder = "resumes") {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { resource_type: "raw", folder },
            (error, result) => {
                if (error) reject(error);
                else resolve(result.secure_url);
            }
        );
        stream.end(buffer);
    });
};
