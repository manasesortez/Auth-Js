const express = require('express');
const passport = require('passport');
const boom = require('@hapi/boom');
const jwt = require('jsonwebtoken');
const ApiKeysServices = require('../services/apiKey');
const validationHandler = require('../utils/middleware/validationHandler');

const { createUsersSchema } = require('../utils/schemas/users');

const { config } = require('../config');
const UsersServices = require('../services/users');

//basic strategy
require('../utils/strategies/basic');

function authApi(app) {
    const router = express.Router();
    app.use('/api/auth', router);

    const apiKeysServices = new ApiKeysServices();
    const usersServices = new UsersServices();

    //sign-in in Js
    router.post('/sign-in', async function(req, res, next) {
        const { apikeyToken } = req.body;

        if (!apikeyToken) {
            next(boom.unauthorized('apiKeyToken is required'));
        }

        passport.authenticate('basic', function(error, user) {
            try {

                if (error || !user) {
                    next(boom.unauthorized());
                }
                req.login(user, { session: false }, async function(error) {
                    if (error) {
                        next(error);
                    }
                    const apiKey = await apiKeysServices.getApiKey({ token: apikeyToken });

                    if (!apiKey) {
                        next(boom.unauthorized());
                    }

                    const { _id: id, name, email } = user;

                    const payload = {
                        sub: id,
                        name,
                        email,
                        scopes: apikeyToken.scopes
                    }
                    const token = jwt.sign(payload, config.authJwtSecret, {
                        expiresIn: '15m'
                    });

                    return res.status(200).json({ token, user: { id, name, email } })
                })
            } catch (error) {
                next(error)
            }
        })(req, res, next);
    })

    //sign-up in Js
    router.post('/sign-up', validationHandler(createUsersSchema), async function(res, req, next) {
        const { body: user } = req;

        try {
            const createdUsersId = await usersServices.createUser({ user });

            res.status(201).json({
                data: createdUsersId,
                message: 'user created'
            });
        } catch (error) {
            return next(error);
        }
    })
}
module.exports = authApi;