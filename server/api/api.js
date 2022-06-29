const apiRouter = require("express").Router();
const posts = require("./posts");
const comments = require("./comments")

apiRouter.get('/', (req, res) => {
    res.send("welcome to the blogApp by starchCode.com");
});


apiRouter.use("/posts", posts);
apiRouter.use("/comments", comments);


module.exports = apiRouter;