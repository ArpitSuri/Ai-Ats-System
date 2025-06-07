const monoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const dbConnection = async () => {
    try {
        await monoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection failed:', error);
        process.exit(1); // Exit the process with failure
    }
}       
module.exports = dbConnection;