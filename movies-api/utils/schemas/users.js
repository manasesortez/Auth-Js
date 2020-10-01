const joi = require('@hapi/joi');

const usersIdSchema = joi.string().regex(/^[0-9a-fA-F]{24}$/);

const createUsersSchema = {
    name: joi.string().max(100).required(),
    email: joi.string().email().required(),
    passpord: joi.string().required(),
    isAdmin: joi.boolean()
};

module.exports = {
    usersIdSchema,
    createUsersSchema
}