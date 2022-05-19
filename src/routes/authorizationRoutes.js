const { registration, login, logout, refresh, getUser } = require('../controllers/userController');

const routes = async (fastify, options, done) => {
  fastify.post('/registration', registration);
  fastify.post('/login', login);
  fastify.get('/refresh', refresh);
  fastify.post('/logout', logout);
  fastify.post('/user', getUser);

  done();
};

module.exports = routes;
