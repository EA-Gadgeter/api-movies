const { Sequelize } = require("sequelize");

const sequelizeConnection = new Sequelize("mysql://root:16AF1GH1Ef4d2dF-eC-66fhC5f1BfFA6@roundhouse.proxy.rlwy.net:49264/railway");

module.exports = {
    sequelizeConnection
}