const MongoLib = require('../lib/mongo');

class UserMoviesServices {
    constructor() {
        this.collection = 'user-movies';
        this.mongoDB = new MongoLib();
    }

    async getUsersMovies({ userId }) {
        const query = userId && { userId };
        const userMovies = await this.mongoDB.getAll(this.collection, query);

        return userMovies || [];
    }

    async createUserMovie({ userMovies }) {
        const createdUserMoviesId = await this.mongoDB.create(
            this.collection,
            userMovies
        );

        return createdUserMoviesId;
    }
    async deleteUsersMovies({ userMoviesId }) {
        const deleteUserMoviesId = await this.mongoDB.delete(
            this.collection,
            userMoviesId
        );

        return deleteUserMoviesId;
    }
}

module.exports = UserMoviesServices;