const { Sequelize } = require("sequelize");

const sequelizeConnection = new Sequelize({
    dialect: "mysql",
    username: "root",
    password: "password",
    host: "localhost",
    port: 3306,
    database: "movies"
});

module.exports = {
    sequelizeConnection
}