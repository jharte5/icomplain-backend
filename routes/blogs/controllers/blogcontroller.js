const Blog = require('../model/Blog')
const dbErrorHelper = require('../../users/AuthHelp/dbErrorHelper');
const User = require('../../users/model/User');


module.exports = {
    createBlog: async (req,res) => {
        try{
            let userID = req.auth._id;
            req.body.createdBy = req.auth._id;
            let createdBlog = new Blog(req.body);
            let success = await createdBlog.save();
            let savedUserBlog = await User.findById({ _id: userID});
            savedUserBlog.blogs.push(success);
            await savedUserBlog.save();
            res.json(success);
        } catch (e) {
            res.status(500).json(dbErrorHelper(e))
        }
    },
    // getAllBlogs: async (re) => {
        
    // }
    
}