const { Router } = require("express");

const { sequelizeConnection } = require("../sequelize");

const servicesRouter= Router();

servicesRouter.get("/", async (req, res) => {
  const [data] = await sequelizeConnection.query("SELECT * FROM service");
  res.json(data);
});

servicesRouter.get("/", async (req, res) => {
  const { id } = req.query;

  const [data] = await sequelizeConnection.query(`SELECT * FROM service WHERE id='${id}'`);

  if (data.length <= 0) {
    res.status(404).json({
      error: true,
      message: "Service not found",
    });
  } else {
    res.json(data[0]);
  }
});

servicesRouter.post("/", async (req, res) => {
  const {
    id,
    name,
    homePage
  } = req.body;

  if (Object.values({ name, id, homePage }).some(value => value === undefined)) {
    res.status(400).json({
      error: true,
      message: "Important info missing"
    })

    return;
  }

  const query = `
    INSERT INTO service
    (id, name, home_page)
    VALUES
    (
      '${id}',
      '${name}',
      '${homePage}'
    );
  `;

  const [newId] = await sequelizeConnection.query(query);

  res.json({
    id: newId,
    ...req.body
  });
});

servicesRouter.put("/", async (req, res) => {
  const {
    prevId,
    newId,
    name,
    homePage
  } = req.body;

  if (Object.values({ name, prevId, newId, homePage }).some(value => value === undefined)) {
    res.status(400).json({
      error: true,
      message: "Important info missing"
    })

    return;
  }

  const query = `
    UPDATE service
    SET
      id='${newId}',
      name='${name}',
      home_page='${homePage}'
    WHERE id='${prevId}';
  `;

  const [resultData] = await sequelizeConnection.query(query);
  const { affectedRows } = resultData;

  if (affectedRows === 0) {
    res.status(404).json({
      error: true,
      message: "Not service found or info is the same",
    })

    return;
  }

  res.json(req.body);
});

servicesRouter.delete("/", async (req, res) => {
  const { id } = req.query;

  const [resultData] = await sequelizeConnection.query(`DELETE FROM service WHERE id='${id}'`);
  const { affectedRows } = resultData;

  if (affectedRows === 0) {
    res.status(404).json({
      error: true,
      message: "Not service found",
    })

    return;
  }

  res.json({
    id
  });
});

module.exports = {
  servicesRouter
};