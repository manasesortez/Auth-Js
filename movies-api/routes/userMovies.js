const { query } = require('express');

const express = require('express');
const UserMoviesServices = require('../services/userMovies');
const validationHandler = require('../utils/middleware/validationHandler');

const { movieIdSchema } = require('../utils/schemas/movies');
const { usersIdSchema } = require('../utils/schemas/users');
const { createUserMovieSchema } = require('../utils/schemas/usersMovies');

function userMoviesApi(app) {
    const router = express.Router();
    app.user('/api/user-movies', router);
    const userMoviesService = new UserMoviesServices();

    //collecion de peliculas del usuario
    router.get('/', validationHandler({ userId: usersIdSchema }, query),
        async function(req, res, next) {
            const { userId } = req.query;

            try {
                const userMovies = await userMoviesService.getUsersMovies({ userId });
                res.status(200).json({
                    data: userMovies,
                    message: 'User Message Listen'
                });
            } catch (error) {
                next(error);
            }
        }
    );

    //post peliculas del usuario
    router.post('/', validationHandler(createUserMovieSchema),
        async function(req, res, next) {
            const { body: userMovies } = req

            try {
                const createdUserMovieId = await userMoviesService.createUserMovie({
                    userMovies
                });

                res.status(201).json({
                    data: createdUserMovieId,
                    message: 'user movie creted'
                })
            } catch (err) {
                next(err);
            }
        })

    router.delete('/:userMoviedId', validationHandler({ userMovieId: movieIdSchema }, 'params'),
        async function(req, res, next) {
            const { userMovieId } = req.params;

            try {
                const deletedUserMovieId = await userMoviesService.deleteUsersMovies({
                    userMovieId
                });

                res.status(200).json({
                    data: deletedUserMovieId,
                    message: 'user Movie Id'
                })
            } catch (err) {
                next(err)
            }
        })

}

module.exports = userMoviesApi;