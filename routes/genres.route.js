const { Router } = require("express");

const { sequelizeConnection } = require("../sequelize");

const genresRouter = Router();

genresRouter.get("/", async (req, res) => {
  const [data] = await sequelizeConnection.query("SELECT * FROM genres");
  res.json(data);
});

genresRouter.get("/:id", async (req, res) => {
  const { id } = req.params;

  const [data] = await sequelizeConnection.query(`SELECT * FROM genres WHERE id=${id}`);

  if (data.length <= 0) {
    res.status(404).json({
      error: true,
      message: "Genre not found",
    });
  } else {
    res.json(data[0]);
  }
});

genresRouter.post("/", async (req, res) => {
  const {
    name
  } = req.body;

  if (Object.values({ name }).some(value => value === undefined)) {
    res.status(400).json({
      error: true,
      message: "Name missing"
    })

    return;
  }

  const query = `
    INSERT INTO genres
    (name)
    VALUES
    (
      '${name}'
    );
  `;

  const [newId] = await sequelizeConnection.query(query);

  res.json({
    id: newId,
    ...req.body
  });
});

genresRouter.put("/", async (req, res) => {
  const {
    id,
    name
  } = req.body;

  if (Object.values({ id, name }).some(value => value === undefined)) {
    res.status(400).json({
      error: true,
      message: "Name or id missing"
    })

    return;
  }

  const query = `
    UPDATE genres
    SET
      name='${name}'
    WHERE id=${id};
  `;

  const [resultData] = await sequelizeConnection.query(query);
  const { affectedRows } = resultData;

  if (affectedRows === 0) {
    res.status(404).json({
      error: true,
      message: "Not genre found or info is the same",
    })

    return;
  }

  res.json(req.body);
});

genresRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;

  const [resultData] = await sequelizeConnection.query(`DELETE FROM genres WHERE id=${id}`);
  const { affectedRows } = resultData;

  if (affectedRows === 0) {
    res.status(404).json({
      error: true,
      message: "Not genre found",
    })

    return;
  }

  res.json({
    id
  });
});

module.exports = {
  genresRouter
};