require("dotenv").config();
const fastify = require("fastify")();
// { logger: true }

fastify.register(require("./routes/authorizationRoutes"));
fastify.register(require("./routes/todosRoutes"));

fastify.register(require("@fastify/cors"), {
  origin: (origin, cb) => {
    const hostname = new URL(origin).hostname;
    if (hostname === "localhost") {
      cb(null, true);
      return;
    }
    cb(new Error("Not allowed"));
  },
  methods: ["POST", "PATCH", "DELETE", "GET"],
  credentials: true,
});
fastify.register(require("@fastify/cookie"), {
  secret: "my-secret", // for cookies signature
  parseOptions: {},
});
// fastify.register(require("@fastify/jwt"), {
//   secret: "supersecret",
// });

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
