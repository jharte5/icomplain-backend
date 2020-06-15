const express = require('express');
const router = express.Router();
const Blog = require('../blogs/model/Blog');
const blogController = require('../blogs/controllers/blogController')
const jwtHelp = require('../users/AuthHelp/jwtHelp')



router.post(
    '/create-blog',
    jwtHelp.checkAuthMiddleware,
    jwtHelp.findUserIfUserExist,
    jwtHelp.hasAuthorization,
    blogController.createBlog)

router.get('/blogs', (req,res) => {
    Blog.find({}).then((blogs) => {
        blogs.reverse();
        return res.json(blogs)
    })
})

router.get("/all-blogs", blogController.getBlogs);


module.exports = router;