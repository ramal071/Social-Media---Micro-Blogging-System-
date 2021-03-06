const Joi = require('joi');
const HttpStatus = require('http-status-codes');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/userModels');
const Helpers = require('../Helpers/helpers');
const dbConfig = require('../config/secret');

module.exports = {
async CreateUser(req, res){

const schema = Joi.object({
    username: Joi.string()
        .min(3)
        .max(30)
        .required(),
    password: Joi.string()
        .min(3)
        .required() , 

        email:Joi.string().min(6).required().email(),
});

//const { error, value } = schema.validate({username});
const { error, value } = schema.validate(req.body);
console.log(value);
//res.send(error.details[0].message);
  if (error && error.details) {
    return res
    .status(HttpStatus.BAD_REQUEST)
    .json({ msg: error.details });

}  
const userEmail = await User.findOne({ 
    email: Helpers.lowerCase(req.body.email)
});
if(userEmail) {
    return res
    .status(HttpStatus.CONFLICT)
    .json({message: 'Email already exist'});
}
const userName = await User.findOne({
    username: Helpers.firstUpper(req.body.username)
});

if (userName){
    return res
    .status(HttpStatus.CONFLICT)
    .json({message: 'Username already exist'});
}
return bcrypt.hash(value.password, 10, (err, hash) => {
    if (err){
        return res
        .status(HttpStatus.BAD_REQUEST)
        .json({message: 'Error hashing password'});
    }  
    const body = {
        username: Helpers.firstUpper(value.username),
        email: Helpers.lowerCase(value.email),
        password:hash
    };
    User.create(body)
    .then(user => {
        const token = jwt.sign({data: user}, dbConfig.secret,{
            expiresIn: '1h' /*  milithappara */
        });
        res.cookie('auth', token);
        res
        .status(HttpStatus.CREATED)
        .json({message: "User created successfully", user, token });
    })
    .catch(err => {
        res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: 'Error occured'});
    });
});
},

async LoginUser(req, res) {
    if(!req.body.username || !req.body.password){
    return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({message: 'No empty field allowed'});
    }

   await User.findOne({ username: Helpers
     //   .firstUpper(res.body.username) })
          .firstUpper(req.body.username) })
    .then(user => {
        if(!user){
            return res
            .status(HttpStatus.NOT_FOUND)
            .json({message: 'Username not found'});
        }
        return bcrypt.compare(req.body.password, user.password)
        .then((result) => {
            if(!result) {
                return res
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .json({message: 'password is incorrect'});
            }
            const token = jwt.sign({data: user}, dbConfig.secret, {
                expiresIn: '1h' /*  expire time  */
            });
            res.cookie('auth', token);
            return res
            .status(HttpStatus.OK)
            .json({message: 'Login successful', user, token});
        });
    })
    .catch(err => {
        return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({message: 'Error occured'});
    }) 
}  
};  