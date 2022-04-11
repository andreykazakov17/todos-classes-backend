const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { getReqData } = require("./utils");
let finalhandler = require('finalhandler');
let http = require('http');
let Router = require('router');
const db = 'mongodb://localhost:27017/todos';

mongoose.connect(db)
	.then((res) => console.log('Connected to DB...'))
	.catch((err) => console.log(err));

const todoSchema = new Schema({
	text: {
		type: String,
		required: true
	},
	completed: {
		type: Boolean,
		required: true
	}
});

const Todo = mongoose.model('Todo', todoSchema);

// let todos = [
//     {
//         id: 1,
//         text: 'Todo1',
//         completed: false
//     },
//     {
//         id: 2,
//         text: 'Todo2',
//         completed: false
//     },{
//         id: 3,
//         text: 'Todo3',
//         completed: false
//     }
// ];

class Controller {

    async getTodos() {
		return await Todo.find();
    }

    async getTodo(id) {
		return await Todo.findOne(id);
    }

    async createTodo(body) {
		const newTodo = new Todo({
			text: body,
			completed: false
		});
		return newTodo;
    }

    async deleteTodo(id) {
        const deletedTodo = await Todo.findByIdAndDelete(id);
        return deletedTodo.id;
    }

    async updateTodoComplete(id) {
        const foundTodo = await Todo.findById(id);

        if(!foundTodo.completed) {
            return await Todo.findByIdAndUpdate(id, { completed: true }, { new: true } );
        } else if (foundTodo.completed) {
            return await Todo.findByIdAndUpdate(id, { completed: false }, { new: true } );
        }
    }

    async updateTodoInput(id, body) {
        const parsedBody = JSON.parse(body);

        await Todo.findByIdAndUpdate(id, { text: parsedBody }, { new: true });
        return await Todo.find();
    }

    async clearCompleted(idsArray) {
        await Todo.deleteMany({ _id: idsArray });
        return Todo.find();
    }

    async checkAllTodos() {

        await Todo.updateMany({ completed: true });
        return Todo.find();
    }

    async uncheckAllTodos() {
        await Todo.updateMany({ completed: false });
        return Todo.find();
    }
}

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

        const allTodos = await new Controller().getTodos();
        res.writeHead(200, headers);

        res.end(JSON.stringify(allTodos));
    })
    .post(async (req, res) => {
        let todo_data = await getReqData(req);
        let todo = await new Controller().createTodo(JSON.parse(todo_data));
        //todos = [...todos, todo];
		//console.log(todo._id.toString());

		todo.save()
			.then((result) => {
				res.writeHead(200, headers);
				res.end(JSON.stringify(todo))
			})
			.catch((err) => {
				console.log(err);
			});
    })
    .patch(async(req, res) => {

        let todos = await Todo.find();

        if (todos.every((todo) => todo.completed)) {
            try {
                let result = await new Controller().uncheckAllTodos();
                res.writeHead(200, headers);
                res.end(JSON.stringify(result));
    
            } catch (error) {
    
                res.setHeader(404, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ message: error }));
            }
        } else if (todos.every((todo) => !todo.completed) || todos.some((todo) => todo.completed)) {
            try {
                let result = await new Controller().checkAllTodos();
                res.writeHead(200, headers);
                res.end(JSON.stringify(result));
    
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
            const todo = await new Controller().getTodo(id);
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
            let todoBody = await getReqData(req);

            let updatedTodos = await new Controller().updateTodoInput(id, todoBody);
            res.writeHead(200, headers);
            res.end(JSON.stringify(updatedTodos));

        } catch (error) {

            res.writeHead(404, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: error }));
        }
    })
    .delete(async(req, res) => {
        try {
            const id = req.url.split("/")[2];

            const result = await new Controller().deleteTodo(id);
            res.writeHead(200, headers);
            res.end(JSON.stringify(result));
        } catch (error) {
            res.writeHead(404, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: error }));
        }
    })
    .patch(async (req, res) => {
        try {
            const id = req.url.split("/")[2];

            let todo = await new Controller().updateTodoComplete(id);
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
        let result = await new Controller().clearCompleted(idsArr);
        res.writeHead(200, headers);
        res.end(JSON.stringify(result));
    })
    .options(async(req, res) => {
        res.writeHead(204, headers);
        res.end();
        return;
    });

server.listen(5001, () => {
	console.log('Listening port 5001');
});