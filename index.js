const express = require("express");

const { mainRouter } = require("./routes/index");

const PORT = 6969;

const app = express();
app.use(express.json());
app.use(mainRouter);

// CRUD
// Create-Read-Update-Delete
app.listen(PORT, () => {
    console.log(`API jalando en el puerto ${PORT}`);
});