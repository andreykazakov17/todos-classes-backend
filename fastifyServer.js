require("dotenv").config();
const fastify = require("fastify")();
const cors = require("@fastify/cors");

fastify.register(require("./routes/todosRoutes"));

// fastify.register(cors, function (instance) {
//   return (req, callback) => {
//     let corsOptions;
//     const origin = req.headers.origin;
//     // do not include CORS headers for requests from localhost
//     const hostname = new URL(origin).hostname;
//     if (hostname === "localhost") {
//       corsOptions = { origin: false };
//     } else {
//       corsOptions = { origin: true };
//     }
//     callback(null, corsOptions); // callback expects two parameters: error and options
//   };
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
