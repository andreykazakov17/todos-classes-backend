const TodoModel = require('../models/TodoModel');
const UserModel = require('../models/UserModel');

const headers = {
  'Access-Control-Allow-Origin': 'http://localhost:3000',
  'Access-Control-Allow-Methods': 'OPTIONS, POST, GET, DELETE, PATCH',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': 2592000,
  'Content-Type': 'application/json',
  'Access-Control-Allow-Credentials': true,
};

const getTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await TodoModel.findOne({ _id: id });
    res.headers(headers);
    res.send(todo);
  } catch (error) {
    res.code(404).send({ message: error.message });
  }
};

const getTodos = async (req, res) => {
  try {
    const user = await req.user;
    if (!user) {
      res.code(500).send({ message: error.message });
      return;
    }
    const todosArr = await TodoModel.find({ user: user.id });
    res.headers(headers);
    res.send(todosArr);
  } catch (error) {
    res.code(404).send({ message: error.message });
  }
};

const addTodo = async (req, reply) => {
  try {
    const userData = await req.user;
    const user = await UserModel.findOne({ _id: userData.id });
    const newTodo = await new TodoModel({
      text: req.body,
      completed: false,
      user: user._id,
    });

    await newTodo.save();
    reply.headers(headers);
    reply.send(JSON.stringify(newTodo));
  } catch (e) {
    res.code(500).send({ message: error.message });
  }
};

const toggleTodos = async (req, res) => {
  const user = await req.user;
  const todos = await TodoModel.find({ user: user.id });
  const todosLength = todos.length;
  const completedTodosLength = todos.filter((todo) => todo.completed).length;
  let isCompleted = null;

  if (todosLength === completedTodosLength) {
    isCompleted = false;
  } else {
    isCompleted = true;
  }

  try {
    await TodoModel.updateMany({ user: user.id }, { completed: isCompleted });
    res.headers(headers);
    res.send(JSON.stringify(await TodoModel.find({ user: user.id })));
  } catch (error) {
    res.code(500).send({ message: error.message });
  }
};

const updateTodo = async (req, res) => {
  try {
    const { id: _id } = req.params;

    const updatedTodo = await TodoModel.findByIdAndUpdate(
      _id,
      { text: req.body.value },
      { new: true },
    );
    res.headers(headers);
    res.send(JSON.stringify(updatedTodo));
  } catch (error) {
    res.code(404).send({ message: error.message });
  }
};

const deleteTodo = async (req, res) => {
  try {
    const { id: _id } = req.params;

    const deletedTodo = await TodoModel.findByIdAndDelete({ _id });
    const deletedTodoId = deletedTodo.id;
    res.headers(headers);
    res.send(JSON.stringify(deletedTodoId));
  } catch (error) {
    res.code(404).send({ message: error.message });
  }
};

const checkTodo = async (req, res) => {
  try {
    const { id: _id } = req.params;

    const foundTodo = await TodoModel.findById({ _id });
    const todo = await TodoModel.findByIdAndUpdate(
      _id,
      { completed: !foundTodo.completed },
      { new: true },
    );
    res.headers(headers);
    res.send(JSON.stringify(todo));
  } catch (error) {
    res.code(404).send({ message: error.message });
  }
};

const clearCompleted = async (req, res) => {
  try {
    const user = await req.user;
    await TodoModel.deleteMany({ _id: req.body });
    res.headers(headers);
    res.send(JSON.stringify(await TodoModel.find({ user: user.id })));
  } catch (error) {
    res.code(500).send({ message: error.message });
  }
};

module.exports = {
  getTodo,
  getTodos,
  addTodo,
  toggleTodos,
  updateTodo,
  deleteTodo,
  checkTodo,
  clearCompleted,
};
