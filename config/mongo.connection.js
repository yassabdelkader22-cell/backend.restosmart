const mongoose=require('mongoose');

module.exports.DB = async () => {
 mongoose.connect(process.env.url_Mongodb ).then(() => {
    console.log('Connected to MongoDB');
 }).catch((err) => {
    console.error('Error connecting to MongoDB:',err);
 });
};

    

