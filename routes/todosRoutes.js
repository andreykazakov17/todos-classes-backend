const cors = require("@fastify/cors");
const TodoModel = require("../models/TodoModel");
const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "OPTIONS, POST, GET, DELETE, PATCH",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Max-Age": 2592000,
  "Content-Type": "application/json",
  "Access-Control-Allow-Credentials": true,
};

const {
  getTodo,
  getTodos,
  addTodo,
  optionsHandler,
} = require("../controllers/todos");

const ItemSchema = {
  type: "object",
  properties: {
    id: { type: "string" },
    text: { type: "string" },
    completed: { type: "boolean" },
  },
};

const getItemsOpts = {
  schema: {
    response: {
      200: {
        type: "array",
        items: ItemSchema,
      },
    },
  },
  handler: getTodos,
};

const getItemOpts = {
  schema: {
    response: {
      200: ItemSchema,
    },
  },
  handler: getTodo,
};

const postItemOpts = {
  schema: {
    response: {
      200: ItemSchema,
    },
  },
  handler: addTodo,
};

const routes = async (fastify, options, done) => {
  fastify.register(require("@fastify/cors"), {
    origin: "*",
    methods: ["POST"],
  });
  fastify.route({
    method: "POST",
    url: "/product",
    handler: optionsHandler,
  });

  fastify.get("/todos", getItemsOpts);
  fastify.get("/todos/:id", getItemOpts);
  fastify.post("/todos", postItemOpts);
  //fastify.options("/todos", optionsHandler);

  done();
};

module.exports = routes;
