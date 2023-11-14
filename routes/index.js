const { Router } = require("express");

const { usersRouter } = require("./users.route");
const { moviesRouter } = require("./movies.route");
const { genresRouter } = require("./genres.route");
const { servicesRouter } = require("./services.route");

const mainRouter = Router();

mainRouter.use("/users", usersRouter);
mainRouter.use("/movies", moviesRouter);
mainRouter.use("/genres", genresRouter);
mainRouter.use("/services", servicesRouter);

module.exports = {
    mainRouter
};