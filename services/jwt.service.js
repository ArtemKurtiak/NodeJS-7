const jwt = require('jsonwebtoken');

const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = require('../constants/constants');
const CustomError = require('../errors/customError');
const { NOT_AUTHORIZED } = require('../constants/status-codes.enum');

module.exports = {
    generateTokens: () => {
        const accessToken = jwt.sign({}, ACCESS_TOKEN_SECRET, {
            expiresIn: '15m'
        });

        const refreshToken = jwt.sign({}, REFRESH_TOKEN_SECRET, {
            expiresIn: '15d'
        });

        return {
            accessToken,
            refreshToken
        };
    },

    validateToken: (token, typeOfToken = 'access') => {
        try {
            const jwtSecretKey = typeOfToken === 'access' ? ACCESS_TOKEN_SECRET : REFRESH_TOKEN_SECRET;

            jwt.verify(token, jwtSecretKey);
        } catch (e) {
            throw new CustomError('Invalid token', NOT_AUTHORIZED);
        }
    }
};
