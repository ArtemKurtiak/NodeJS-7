const router = require('express').Router();

const { checkAccessToken, checkRefreshToken } = require('../middlewares/auth.middleware');
const {
    isFullDataInUserRequest, isLoginBodyCorrect, checkUserAvailability, isUserNotExists, isUserExists
} = require('../middlewares/user.middleware');
const {
    login, register, refreshToken, logout, logoutEverywhere
} = require('../controllers/auth.controller');

router.post('/register', isFullDataInUserRequest, checkUserAvailability('email'), isUserNotExists, register);

router.post('/login', isLoginBodyCorrect, checkUserAvailability('email'), isUserExists, login);

router.post('/refresh', checkRefreshToken, refreshToken);

router.post('/logout', checkAccessToken, logout);

router.post('/logout_everywhere', checkAccessToken, logoutEverywhere);

module.exports = router;
