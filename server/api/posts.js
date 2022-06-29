const posts = require("express").Router();

posts.get("/", (req, res) => {
    res.send("Here are all your posts!")
})

module.exports = posts;