const CustomError = require('../errors/customError');
const { CREATED, NOT_AUTHORIZED, NO_CONTENT } = require('../constants/status-codes.enum');
const { hashPassword, comparePasswords } = require('../services/password.service');
const { generateTokens } = require('../services/jwt.service');
const { User, OAuth } = require('../db');
const { normalizeUser } = require('../utils/user.util');

module.exports = {

    register: async (req, res, next) => {
        try {
            const { email, password, role } = req.body;

            const hashedPassword = await hashPassword(password);

            const user = await User.create({
                email,
                password: hashedPassword,
                role
            });

            const normalizedUser = normalizeUser(user);

            const tokenPair = generateTokens();

            await OAuth.create({
                ...tokenPair,
                user: user._id
            });

            res
                .status(CREATED)
                .json({ normalizedUser, ...tokenPair });
        } catch (e) {
            return next(e);
        }
    },

    login: async (req, res, next) => {
        try {
            const { user, body: { password } } = req;

            await comparePasswords(password, user.password);

            const normalizedUser = normalizeUser(user);

            const tokenPair = generateTokens();

            await OAuth.create({
                ...tokenPair,
                user: user._id
            });

            res
                .json({ normalizedUser, ...tokenPair });
        } catch (e) {
            return next(e);
        }
    },

    refreshToken: async (req, res, next) => {
        try {
            const { token } = req;

            const newTokenPair = generateTokens();

            const DbToken = await OAuth.findOneAndUpdate({ refreshToken: token }, { ...newTokenPair });

            if (!DbToken) {
                throw new CustomError('Invalid token', NOT_AUTHORIZED);
            }

            res
                .status(200)
                .json({
                    ...newTokenPair
                });
        } catch (e) {
            next(e);
        }
    },

    logout: async (req, res, next) => {
        try {
            const token = req.get('Authorization');

            if (!token) {
                throw new CustomError('JWT Token not found', NOT_AUTHORIZED);
            }

            await OAuth.deleteOne({ accessToken: token });

            res
                .status(NO_CONTENT)
                .json('Success');
        } catch (e) {
            next(e);
        }
    },

    logoutEverywhere: async (req, res, next) => {
        try {
            const { currentUser } = req;

            await OAuth.deleteMany({ user: currentUser });

            res
                .status(NO_CONTENT)
                .json('Success');
        } catch (e) {
            next(e);
        }
    }
};
