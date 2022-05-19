const ArraySchema = require('../schemes/ArraySchema');
const ObjectSchema = require('../schemes/ObjectSchema');
const auth = require('../middleware/auth');

const {
  getTodo,
  getTodos,
  addTodo,
  toggleTodos,
  updateTodo,
  deleteTodo,
  checkTodo,
  clearCompleted,
} = require('../controllers/todosController');

const getItemsOpts = ArraySchema(auth, getTodos);
const getItemOpts = ObjectSchema(auth, getTodo);
const addTodoOpts = ObjectSchema(auth, addTodo);
const updateItemOpts = ObjectSchema(auth, updateTodo);
const deleteItemOpts = ObjectSchema(auth, deleteTodo);
const checkItemOpts = ObjectSchema(auth, checkTodo);
const clearCompletedOpts = ObjectSchema(auth, clearCompleted);
const toggleTodosOpts = ArraySchema(auth, toggleTodos);

const routes = async (fastify, options, done) => {
  fastify.get('/todos', getItemsOpts);
  fastify.get('/todos/:id', getItemOpts);
  fastify.post('/todos', addTodoOpts);
  fastify.post('/todos/:id', updateItemOpts);
  fastify.post('/todos/clearAll', clearCompletedOpts);
  fastify.patch('/todos', toggleTodosOpts);
  fastify.patch('/todos/:id', checkItemOpts);
  fastify.delete('/todos/:id', deleteItemOpts);

  done();
};

module.exports = routes;
