const { required } = require('joi');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
    username: {type: String },
    email: { type: String },
    password: { type: String },
    posts:[
        {
            postId: 
            { type: mongoose.Schema.Types.ObjectId, ref: 'Post'},
            post: { type: String },
            created: { type: Date, default: Date.now()}
        }
    ],

    following: [
        { userFollowed: { type: mongoose.Schema.Types.ObjectId, ref: 'User'}}
    ],
    followers: [
        { follower: { type: mongoose.Schema.Types.ObjectId, ref: 'User'}}
    ] ,
    notification: [
        {
            senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
            message: { type: String},
            viewProfile: { type: Boolean, default: false },
            created: { type: Date, default: Date.now() },
            read: { type: Boolean, default: false },
            date: { type: String, default: '' }
        }
    ],
    chatList: [
        {
            receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            msgId: { type: mongoose.Schema.Types.ObjectId, ref: 'Message'}
        }
    ],

    picVersion: { type: String, default: '1605497045' },
    picId: {type: String, default: 'qlchm0d9hsuexkqcfxhd.png'},
    images: [
        {
            imgId: {type: String, default: ''},
            imgVersion: {type: String, default: ''},
        }
    ],

    city: {type: String, default: ''},
    country: {type: String, default: ''}
});  

userSchema.statics.EncryptPassword = async function(password) {
    const hash = await bcrypt.hash(password, 10);
    return hash;
}

module.exports = mongoose.model('User', userSchema); 

 