const { validateAccessToken } = require('../service/tokenService');

const UnauthorizedError = new Error('User not authorized');
UnauthorizedError.statusCode = '401';

module.exports = function (req, res, next) {
  try {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
      throw UnauthorizedError;
    }

    const accessToken = authorizationHeader.split(' ')[1];
    if (!accessToken) {
      throw UnauthorizedError;
    }
    const userData = validateAccessToken(accessToken);
    if (!userData) {
      throw UnauthorizedError;
    }

    req.user = userData;
    next();
  } catch (e) {
    throw UnauthorizedError;
  }
};
