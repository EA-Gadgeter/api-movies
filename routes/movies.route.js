const { Router } = require("express");

const { sequelizeConnection } = require("../sequelize");

const moviesRouter= Router();

const escapeString = (str) => {
    return str.replace(/['\"]/g, "");
}


moviesRouter.get("/", async (req, res) => {
    const { limit, idGenre } = req.query;

    let finalQuery = "SELECT * FROM movie";

    if (idGenre) {
        finalQuery = `SELECT * FROM movie INNER JOIN genres ON movie.id_genre=genres.id WHERE movie.id_genre=${idGenre}`;
    }

    if (limit) {
        finalQuery = `${finalQuery} LIMIT ${limit}`;
    }

    const [data] = await sequelizeConnection.query(finalQuery);
    res.json(data);
});

moviesRouter.get("/by-service", async (req, res) => {
    const { limit, idService } = req.query;

    if (!idService) {
        res.status(400).json({
            message: "idGenre is required",
            error: true,
        });

        return;
    }

    let finalQuery = `
        SELECT
            movie.id AS movieId,
            title AS movieTitle,
            year,
            plot,
            rating,
            language,
            service.name AS serviceName
        FROM
            movie INNER JOIN service_movie
            ON movie.id=service_movie.id_movie
            INNER JOIN service ON service_movie.id_service=service.id
        WHERE service_movie.id_service='${idService}';
    `;

    if (limit) {
        finalQuery = `${finalQuery} LIMIT ${limit}`;
    }
    
    const [data] = await sequelizeConnection.query(finalQuery);
    res.json(data);
});

moviesRouter.get("/:id", async (req, res) => {
    const { id } = req.params;

    const [data] = await sequelizeConnection.query(`SELECT * FROM movie WHERE id=${id}`);

    if (data.length <= 0) {
        res.status(404).json({
            error: true,
            message: "Movie not found",
        });
    } else {
        res.json(data[0]);
    }
});

moviesRouter.post("/", async (req, res) => {
    const { 
        title,
        year,
        originalTitle,
        imdbId,
        idGenre,
        plot,
        rating,
        rated,
        language,
        country
    } = req.body;

    if (Object.values({
        title, year, 
        originalTitle, imdbId, 
        idGenre, plot,
        rating, rated,
        language, country
    }).some(value => value === undefined)) {
        res.status(400).json({
            error: true,
            message: "Important info missing"
        })

        return;
    }

    const query = `
        INSERT INTO movie
        (
            title, year, 
            original_title, imdbId, 
            id_genre,
            plot, rating,
            rated, language,
            country
        )
        VALUES
        (
            '${escapeString(title)}',
            ${year},
            '${escapeString(originalTitle)}',
            '${imdbId}',
            ${idGenre},
            '${escapeString(plot)}',
            '${rating}',
            '${rated}',
            '${language}',
            '${country}'
        );
    `;

    const [ newId ] = await sequelizeConnection.query(query);

    res.json({
        id: newId,
        ...req.body
    });
});

moviesRouter.put("/", async (req, res) => {
    const {
        id,
        title,
        year,
        originalTitle,
        imdbId,
        idGenre,
        plot,
        rating, 
        rated,
        language,
        country
    } = req.body;

    if (Object.values({
        id, title, year, 
        originalTitle, imdbId, 
        idGenre, plot,
        rating, rated,
        language, country
    }).some(value => value === undefined)) {
        res.status(400).json({
            error: true,
            message: "Important info missing"
        })

        return;
    }

    const query = `
        UPDATE movie
        SET
            title='${escapeString(title)}',
            year=${year},
            original_title='${escapeString(originalTitle)}',
            imdbId='${imdbId}',
            id_genre=${idGenre},
            plot='${escapeString(plot)}',
            rating='${rating}',
            rated='${rated}',
            language='${language}',
            country='${country}'
        WHERE id=${id};
    `;

    const [ resultData ] = await sequelizeConnection.query(query);
    const { affectedRows } = resultData;
    
    if (affectedRows === 0) {
        res.status(404).json({
            error: true,
            message: "Not movie found or info is the same",
        })

        return;
    }

    res.json(req.body);
});

moviesRouter.delete("/:id", async (req, res) => {
    const { id } = req.params;

    const [ resultData ] = await sequelizeConnection.query(`DELETE FROM movie WHERE id=${id}`);
    const { affectedRows } = resultData;
  
    if (affectedRows === 0) {
        res.status(404).json({
            error: true,
            message: "Movie not found",
        })

        return;
    }

    res.json({
        id
    });
});

module.exports = {
    moviesRouter
};