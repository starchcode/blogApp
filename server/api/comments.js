const comments = require("express").Router();

comments.get("/", (req, res) => {
    res.send("Here are all your comments!")
});

module.exports = comments;