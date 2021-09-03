const CustomError = require('../errors/customError');
const { NOT_AUTHORIZED } = require('../constants/status-codes.enum');
const { validateToken } = require('../services/jwt.service');
const { OAuth } = require('../db');
const { dbTablesEnum } = require('../constants');

module.exports = {
    checkAccessToken: async (req, res, next) => {
        try {
            const token = req.get('Authorization');

            if (!token) {
                throw new CustomError('JWT Token not found', NOT_AUTHORIZED);
            }

            await validateToken(token);

            const DbToken = await OAuth.findOne({ accessToken: token }).populate(dbTablesEnum.USER);

            if (!DbToken) {
                throw new CustomError('Invalid token', NOT_AUTHORIZED);
            }

            req.currentUser = DbToken.user;
            req.token = DbToken;

            next();
        } catch (e) {
            next(e);
        }
    },

    checkRefreshToken: async (req, res, next) => {
        try {
            const token = req.get('Authorization');

            if (!token) {
                throw new CustomError('JWT Token not found', NOT_AUTHORIZED);
            }

            await validateToken(token, 'refresh');

            req.token = token;

            next();
        } catch (e) {
            next(e);
        }
    },
};
