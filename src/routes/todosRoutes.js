const ArraySchema = require("../schemes/ArraySchema");
const ObjectSchema = require("../schemes/ObjectSchema");
const auth = require("../middleware/auth");

const {
  getTodo,
  getTodos,
  addTodo,
  toggleTodos,
  updateTodo,
  deleteTodo,
  checkTodo,
  clearCompleted,
} = require("../controllers/todosController");

const getItemsOpts = ArraySchema(getTodos);
const getItemOpts = ObjectSchema(getTodo);
const updateItemOpts = ObjectSchema(updateTodo);
const deleteItemOpts = ObjectSchema(deleteTodo);
const checkItemOpts = ObjectSchema(checkTodo);
const clearCompletedOpts = ObjectSchema(clearCompleted);

const routes = async (fastify, options, done) => {
  fastify.get("/todos", { schema: ArraySchema, preHandler: [auth] }, getTodos);
  fastify.get("/todos/:id", getItemOpts);
  fastify.post("/todos", { schema: ObjectSchema, preHandler: [auth] }, addTodo);
  fastify.post("/todos/:id", updateItemOpts);
  fastify.post(
    "/todos/clearAll",
    { schema: ObjectSchema, preHandler: [auth] },
    clearCompleted
  );
  fastify.patch(
    "/todos",
    { schema: ObjectSchema, preHandler: [auth] },
    toggleTodos
  );
  fastify.patch("/todos/:id", checkItemOpts);
  fastify.delete("/todos/:id", deleteItemOpts);

  done();
};

module.exports = routes;
