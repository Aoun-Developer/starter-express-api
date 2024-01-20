const mongoose_my = require('mongoose');
const mongoURI_my = "mongodb+srv://aoundeveloper:aoun12@cluster1.f0uwccd.mongodb.net/inotebook "

const connectToMongo_my = async () => {
    await mongoose_my.connect(mongoURI_my);
    console.log("mongodb connect")
}

module.exports = connectToMongo_my;