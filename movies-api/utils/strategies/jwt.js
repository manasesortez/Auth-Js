const passport = require('passport');
const { Strategy, ExtractJwt } = require('passport-http');
const boom = require('@hapi/boom');

const UserService = require('../../services/users');
const { config } = require('../../config/index');

passport.use(
    new Strategy({
            secretOrKey: config.authJwtSecret,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
        },
        async function(tokenPayloadm, cb) {
            const usersServices = new usersServices();

            try {
                const user = await UserService.getUser({ email: tokenPayloadm.email });
                if (!user) {
                    return cb(boom.unauthorized(), false);
                }
                delete user.password;
                cb(null, {...user, scope: tokenPayloadm.scopes });
            } catch (error) {
                return cb.err(error);
            }
        })
)