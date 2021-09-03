module.exports = {
    EMAIL_REGEXP: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PASSWORD_REGEXP: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%\\^&\\*])(?=.{8,128})/,
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET || 'secret1221',
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET || '123secretkey'
};
