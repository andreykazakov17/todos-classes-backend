const {
  registration,
  login,
  logout,
  refresh,
} = require("../controllers/userController");

const routes = async (fastify, options, done) => {
  fastify.post("/registration", registration);
  fastify.post("/login", login);
  fastify.post("/logout", logout);
  fastify.get("/refresh", refresh);

  done();
};

module.exports = routes;
