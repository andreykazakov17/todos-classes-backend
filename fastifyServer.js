require("dotenv").config();
const fastify = require("fastify")();

fastify.register(require("./routes/todosRoutes"));

fastify.register(require("@fastify/cors"), {
  origin: "*",
  methods: ["POST", "PATCH", "DELETE", "GET"],
});
const connect = require("./dbConnection");
connect();

const start = async () => {
  try {
    await fastify.listen(process.env.PORT);
  } catch (error) {
    fastify.log.error(error);
    process.exit(1);
  }
};

start();
