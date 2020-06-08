const bcrypt = require('bcryptjs');
const User = require('../model/User');
const dbErrorHelper = require('../AuthHelp/dbErrorHelper');
const jwtHelper = require('../AuthHelp/jwtHelp')

module.exports ={
    createUser: async (req,res) => {
        try {
            let newUser = await new User({
                email: req.body.email,
                password: req.body.password,
                username: req.body.username,
            });
            let genSalt = await bcrypt.genSalt(12);
            let hashedPassword = await bcrypt.hash(newUser.password, genSalt);
            newUser.password = hashedPassword;
            await newUser.save();
            res.json({
                message: 'user created',
            });
        } catch (e) {
            console.log(e)
            res.status(500).json({
                message: dbErrorHelper(e)
            })
        }
    },
    login: async (req,res) => {
        try{
            let foundUser = await (await User.findOne({ email: req.body.email})).select('-__v -userCreated')
            if (foundUser === null) {
                throw Error('user not found, plz sign up')
            }
            let comparePassword = await jwtHelper.comparePassword(
                req.body.password,
                foundUser.password
            )
            if (comparePassword === 409) {
                throw Error('check email and/or password')
            }
            let jwtTokenObj = await jwtHelper.createJwtToken(foundUser)
            foundUser = foundUser.toObject()
            delete foundUser.password
            res.json({ user : foundUser})
        }catch (e){
            console.log(e)
            res.status(500).json({
                message:dbErrorHelper(e),
            })
        }
    }
    
}