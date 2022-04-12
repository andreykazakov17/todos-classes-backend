const mongoose = require('mongoose');
const { getReqData } = require("./utils");
let finalhandler = require('finalhandler');
let http = require('http');
let Router = require('router');
require('dotenv').config();
const Todo = require('./models/Todo');

mongoose.connect(process.env.DB_PATH)
	.then((res) => console.log('Connected to DB...'))
	.catch((err) => console.log(err));

let router = Router();
let server = http.createServer(async (req, res) => {
	router(req, res, finalhandler(req, res));
});
const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'OPTIONS, POST, GET, DELETE, PATCH',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': 2592000,
    'Content-Type': 'application/json',
    'Access-Control-Allow-Credentials': true
};

router.route('/todos')
    .get(async (req, res) => {

        const allTodos = await Todo.find();
        res.writeHead(200, headers);

        res.end(JSON.stringify(allTodos));
    })
    .post(async (req, res) => {
        let body = await JSON.parse(await getReqData(req));

        let newTodo = await new Todo({
			text: body,
			completed: false
		});

		newTodo.save()
			.then((result) => {
				res.writeHead(200, headers);
				res.end(JSON.stringify(newTodo))
			})
			.catch((err) => {
				console.log(err);
			});
    })
    .patch(async(req, res) => {

        let todos = await Todo.find();

        if (todos.every((todo) => todo.completed)) {
            try {
                await Todo.updateMany({ completed: false });
                res.writeHead(200, headers);
                res.end(JSON.stringify(await Todo.find()));
    
            } catch (error) {
    
                res.setHeader(404, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ message: error }));
            }
        } else if (todos.every((todo) => !todo.completed) || todos.some((todo) => todo.completed)) {
            try {
                await Todo.updateMany({ completed: true });
                res.writeHead(200, headers);
                res.end(JSON.stringify(await Todo.find()));
    
            } catch (error) {
    
                res.statusCode = 404;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ message: error }));
            }
        }
    })
    .options(async(req, res) => {
        res.writeHead(204, headers);
        res.end();
        return;
    });


router.route(/\/todos\/([0-9]+)/)
    .get(async(req, res) => {
        try {

            const id = req.url.split("/")[2];
            const todo = await Todo.findOne(id);
            res.writeHead(200, headers);
            res.end(JSON.stringify(todo));

        } catch (error) {
            res.writeHead(404, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: error }));
        }
    })
    .post(async(req, res) => {
        try {
            const id = req.url.split("/")[2];
            let todoBody = JSON.parse(await getReqData(req));

            let updatedTodo = await Todo.findByIdAndUpdate(id, { text: todoBody }, { new: true })
            res.writeHead(200, headers);
            res.end(JSON.stringify(updatedTodo));

        } catch (error) {

            res.writeHead(404, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: error }));
        }
    })
    .delete(async(req, res) => {
        try {
            const id = req.url.split("/")[2];

            const deletedTodo = await Todo.findByIdAndDelete(id);
            const deletedTodoId = deletedTodo.id;
            res.writeHead(200, headers);
            res.end(JSON.stringify(deletedTodoId));
        } catch (error) {
            res.writeHead(404, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: error }));
        }
    })
    .patch(async (req, res) => {
        try {
            const id = req.url.split("/")[2];

            const foundTodo = await Todo.findById(id);
            let todo = await Todo.findByIdAndUpdate(id, { completed: !foundTodo.completed }, { new: true });
            res.writeHead(200, headers);
            res.end(JSON.stringify(todo));

        } catch (error) {

            res.writeHead(404, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: error }));
        }
    })
    .options(async(req, res) => {
        res.writeHead(204, headers);
        res.end();
        return;
    });

router.route('/todos/clearAll')
    .post(async(req, res) => {
        let str = await getReqData(req);

        let idsArr = str.split(',');
        await Todo.deleteMany({ _id: idsArr });
        res.writeHead(200, headers);
        res.end(JSON.stringify(await Todo.find()));
    })
    .options(async(req, res) => {
        res.writeHead(204, headers);
        res.end();
        return;
    });

server.listen(process.env.PORT, () => {
	console.log(`Listening port ${process.env.PORT}`);
});