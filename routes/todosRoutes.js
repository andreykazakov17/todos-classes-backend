const ArraySchema = require("../schemes/ArraySchema");
const ObjectSchema = require("../schemes/ObjectSchema");

const {
  getTodo,
  getTodos,
  addTodo,
  toggleTodos,
  updateTodo,
  deleteTodo,
  checkTodo,
  clearCompleted,
} = require("../controllers/todos");

const getItemsOpts = ArraySchema(getTodos);
const getItemOpts = ObjectSchema(getTodo);
const postItemOpts = ObjectSchema(addTodo);
const updateItemsOpts = ObjectSchema(toggleTodos);
const updateItemOpts = ObjectSchema(updateTodo);
const deleteItemOpts = ObjectSchema(deleteTodo);
const checkItemOpts = ObjectSchema(checkTodo);
const clearCompletedOpts = ObjectSchema(clearCompleted);

const routes = async (fastify, options, done) => {
  fastify.get("/todos", getItemsOpts);
  fastify.get("/todos/:id", getItemOpts);
  fastify.post("/todos", postItemOpts);
  fastify.post("/todos/:id", updateItemOpts);
  fastify.post("/todos/clearAll", clearCompletedOpts);
  fastify.patch("/todos", updateItemsOpts);
  fastify.patch("/todos/:id", checkItemOpts);
  fastify.delete("/todos/:id", deleteItemOpts);

  done();
};

module.exports = routes;
