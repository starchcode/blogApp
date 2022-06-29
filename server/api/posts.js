const posts = require("express").Router();
const User = require("../model/User");

posts.get("/", async (req, res) => {
    res.send("Here are all your posts!")

})

// some practice
// posts.get("/:id", async (req, res) => {
//     const requestedId = req.params.id;
//     const user = await User.findOne({ where: { id: requestedId }});
//     res.send(user);
// });


module.exports = posts;