const bcrypt = require('bcryptjs');
const User = require('../model/User');
const dbErrorHelper = require('../AuthHelp/dbErrorHelper');
const jwtHelper = require('../AuthHelp/jwtHelp')
const faker = require('faker')

module.exports ={
    createUser: async (req,res) => {
        try {
            let newUser = await new User({
                email: req.body.email,
                password: req.body.password,
                username: req.body.username = req.body.profile.name,
                profile: req.body.profile.picture = faker.image.avatar(),
                
            });
            console.log(newUser)
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
            let foundUser = await User.findOne({ email: req.body.email}).select('-__v -userCreated')
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
            res.json({ user : foundUser, token: jwtTokenObj})
        }catch (e){
            console.log(e)
            res.status(500).json({
                message:dbErrorHelper(e),
            })
        }
    },
    logout: async (req,res) => {
        res.clearCookie('jwt-cookie-blog');
        res.clearCookie('jwt-cookie-refresh-blog');
        res.end
    },
    updateProfile: (params, id) => {
        const { username, email} = params;
        return new Promise((resolve, reject) => {
            User.findById(id)
            .then(user => {
                if(username) user.profile.name = username;
                if(email) user.email = email;
                return user;
            })
            .then(user => {
                user.save().then(user => {
                    resolve(user)
                })
            })
            .catch(err => reject(err));
        }).catch(err => reject(err))
    },
    createNewJWTAndRefreshToken: async (req, res) => {
        try {   
            let jwtTokenObj = await jwtHelper.createJwtToken(req.profile)

            console.log(jwtTokenObj)
            res.cookie('jwt-cookie-blog' , jwtTokenObj.jwtToken, {
                expires: new Date(Date.now() + 360000),
                httpOnly: false,
                secure: process.env.NODE_ENV === production ? true: false,
            })
            res.cookie('jwt-cookie-blog' , jwtTokenObj.jwtRefreshToken, {
                expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                httpOnly: false,
                secure: process.env.NODE_ENV === production ? true: false,
            })
            res.status(200).json({
                status: 200,
                message: "Successfully renewed token and refresh token",
            });
        } catch (e) {
            res.status(500).json({
                message:dbErrorHelper(e)
            })
        }
    }
    
}