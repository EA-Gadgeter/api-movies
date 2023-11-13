const { Router } = require("express");

const { usersRouter } = require("./users.route");
const { moviesRouter } = require("./movies.route");

const mainRouter = Router();

mainRouter.use("/users", usersRouter);
mainRouter.use("/movies", moviesRouter);

module.exports = {
    mainRouter
};