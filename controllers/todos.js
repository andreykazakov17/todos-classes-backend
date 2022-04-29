const TodoModel = require("../models/TodoModel");

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "OPTIONS, POST, GET, DELETE, PATCH",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Max-Age": 2592000,
  "Content-Type": "application/json",
  "Access-Control-Allow-Credentials": true,
};

const getTodo = async (req, res) => {
  const { id } = req.params;
  res.headers(headers);
  res.send(await TodoModel.findOne({ _id: id }));
};

const getTodos = async (req, res) => {
  res.headers(headers);
  res.send(await TodoModel.find());
};

const addTodo = async (req, reply) => {
  console.log(req.body);
  let newTodo = await new TodoModel({
    text: req.body,
    completed: false,
  });

  await newTodo.save();
  //reply.headers(headers);
  reply.send(JSON.stringify(newTodo));
};

const optionsHandler = async (req, reply) => {
  reply.headers(headers);
  reply.code(204).send();
};

const opts = {
  schema: {
    response: {
      204: {
        type: "object",
        properties: {
          hello: { type: "string" },
        },
      },
    },
  },
};

module.exports = {
  getTodo,
  getTodos,
  addTodo,
  optionsHandler,
};
