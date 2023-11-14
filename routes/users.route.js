const { Router } = require("express");

const { sequelizeConnection } = require("../sequelize");

const usersRouter = Router();

usersRouter.get("/", async (req, res) => {
    const [data] = await sequelizeConnection.query("SELECT * FROM user");
    res.json(data);
});

usersRouter.get("/favorite-genre-movies", async (req, res) => {
    const { idUser } = req.query;

    if (!idUser) {
        res.status(400).json({
            message: "idUser is required",
            error: true,
        });

        return;
    }

    const query = `
        SELECT
            movie.title as movieTitle,
            genres.name as movieGenre,
            plot
        FROM user
        INNER JOIN genres
            ON user.id_favorite_genre=genres.id
        INNER JOIN movie
            ON genres.id=movie.id_genre
        WHERE user.id=${idUser};
    `;

    const [data] = await sequelizeConnection.query(query);
    res.json(data);
});

usersRouter.get("/movies-from-services", async (req, res) => {
    const { idUser } = req.query;

    if (!idUser) {
        res.status(400).json({
            message: "idUser is required",
            error: true,
        });

        return;
    }

    const query = `
        SELECT
            first_name AS userName,
            last_name AS userLastName,
            service_movie.id_service AS service,
            imdbId,
            title AS movieTitle,
            plot
        FROM user
        INNER JOIN user_service
            ON user.id=user_service.id_user
        INNER JOIN service_movie
            ON user_service.id_service = service_movie.id_service
        INNER JOIN movie
            ON service_movie.id_movie = movie.id
        WHERE user.id=${idUser};
    `;

    const [data] = await sequelizeConnection.query(query);
    res.json(data);
});

usersRouter.get("/:id", async (req, res) => {
    const { id } = req.params;

    const [data] = await sequelizeConnection.query(`SELECT * FROM user WHERE id=${id}`);

    if (data.length <= 0) {
        res.status(404).json({
            error: true,
            message: "User not found",
        });
    } else {
        res.json(data[0]);
    }
});

usersRouter.post("/", async (req, res) => {
    const { 
        firstName,
        lastName,
        idFavoriteGenre,
        email,
        age,
        genre
    } = req.body;

    if (Object.values({firstName, lastName, idFavoriteGenre, email, age, genre}).some(value => value === undefined)) {
        res.status(400).json({
            error: true,
            message: "Important info missing"
        })

        return;
    }

    const query = `
        INSERT INTO user
        (first_name, last_name, id_favorite_genre, email, age, genre)
        VALUES
        (
            '${firstName}',
            '${lastName}',
            ${idFavoriteGenre},
            '${email}',
            ${age},
            '${genre}'
        );
    `;

    const [ newId ] = await sequelizeConnection.query(query);

    res.json({
        id: newId,
        ...req.body
    });
});

usersRouter.put("/", async (req, res) => {
    const { 
        id,
        firstName,
        lastName,
        idFavoriteGenre,
        email,
        age,
        genre
    } = req.body;

    if (Object.values({id, firstName, lastName, idFavoriteGenre, email, age, genre}).some(value => value === undefined)) {
        res.status(400).json({
            error: true,
            message: "Important info missing"
        })

        return;
    }

    const query = `
        UPDATE user
        SET
            first_name='${firstName}',
            last_name='${lastName}',
            id_favorite_genre=${idFavoriteGenre},
            email='${email}',
            age=${age},
            genre='${genre}'
        WHERE id=${id};
    `;

    const [ resultData ] = await sequelizeConnection.query(query);
    const { affectedRows } = resultData;
    
    if (affectedRows === 0) {
        res.status(404).json({
            error: true,
            message: "Not user found or info is the same",
        })

        return;
    }

    res.json(req.body);
});

usersRouter.delete("/:id", async (req, res) => {
    const { id } = req.params;

    const [ resultData ] = await sequelizeConnection.query(`DELETE FROM user WHERE id=${id}`);
    const { affectedRows } = resultData;
  
    if (affectedRows === 0) {
        res.status(404).json({
            error: true,
            message: "Not user found",
        })

        return;
    }

    res.json({
        id
    });
});

module.exports = {
    usersRouter
};