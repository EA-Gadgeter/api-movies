const { Router } = require("express");

const { usersRouter } = require("./users.route");
const { moviesRouter } = require("./movies.route");
const { genresRouter } = require("./genres.route")

const mainRouter = Router();

mainRouter.use("/users", usersRouter);
mainRouter.use("/movies", moviesRouter);
mainRouter.use("/genres", genresRouter);

module.exports = {
    mainRouter
};