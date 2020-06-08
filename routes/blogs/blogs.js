const express = require('express');
const router = express.Router;
const Blog = require('../blogs/model/Blog');

router.post('/blogs', (req,res) => {
    const newBlog = new Blog();
    newBlog.title = req.body.title;
    newBlog.image = req.body.image;
    newBlog.article = req.body.article;
    newBlog.save().then((blog) => {
        return res.json(blog)
    })
})

router.get('/blogs', (req,res) => {
    Blog.find({}).then((blogs) => {
        blogs.reverse();
        return res.json(blogs)
    })
})

router.delete('/blog/:id',(req,res) => {
    Blog.findByIdAndDelete({ _id: req.params.id}).then(
        res.json({ message: 'deleted'})
    )
})

module.exports = router;