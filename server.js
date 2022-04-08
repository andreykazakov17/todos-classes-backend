const { getReqData } = require("./utils");
let finalhandler = require('finalhandler');
let http = require('http');
let Router = require('router');

let todos = [
    {
        id: 1,
        text: 'Todo1',
        completed: false
    },
    {
        id: 2,
        text: 'Todo2',
        completed: false
    },{
        id: 3,
        text: 'Todo3',
        completed: false
    }
];

class Controller {

    async getTodos() {
        return todos;
    }

    async getTodo(id) {
        let todo = todos.find((todo) => todo.id === parseInt(id));
        return todo;
    }

    async createTodo(body) {
        let newTodo = {
            id: new Date().getTime(),
            text: body,
            completed: false
        };
        return newTodo;
    }

    async deleteTodo(id) {
        const deletedTodo = todos.find((todo) => todo.id === parseInt(id));
        todos = todos.filter((todo) => todo.id !== parseInt(id));
        return deletedTodo.id;
    }

    async updateTodoComplete(id) {
        let checkedTodo = todos.find((todo) => todo.id === parseInt(id));
        checkedTodo.completed = !checkedTodo.completed;
        return checkedTodo;
    }

    async updateTodoInput(id, body) {
        const parsedBody = JSON.parse(body);
        return todos = todos.map((todo) => todo.id === parseInt(id) ? { ...todo, text: parsedBody } : todo);
    }

    async clearCompleted(idsArray) {
        todos = todos.filter((todo) => !idsArray.includes(todo.id));
        return todos;
    }

    async checkAllTodos() {
        return todos = todos.map((todo) => {
            return {...todo, completed: true};
        });
    }

    async uncheckAllTodos() {
        return todos = todos.map((todo) => {
            return {...todo, completed: false}
        });
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
        todos = [...todos, todo];
        res.writeHead(200, headers);
        res.end(JSON.stringify(todo));
    })
    .patch(async(req, res) => {

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

        let numArr = str.split(',').map((num) => +num);
        let result = await new Controller().clearCompleted(numArr);
        res.writeHead(200, headers);
        res.end(JSON.stringify(result));
    })
    .options(async(req, res) => {
        res.writeHead(204, headers);
        res.end();
        return;
    });

server.listen(5001);