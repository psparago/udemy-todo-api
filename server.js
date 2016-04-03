var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');

var app = express();
var PORT = process.env.PORT || 3000;

var todos = [];
var todoNextID = 1;

app.use(bodyParser.json());

app.get('/', 
	function(req, res) {
		res.send('Todo API Root');
	}
);

// GET /todos
app.get('/todos', 
	function(req, res) {
		res.json(todos);
	}
);

// GET /todos/:id
app.get('/todos/:id', 
	function(req, res) {
		var todoID = parseInt(req.params.id, 10);
		
		var matchedTodo = _.findWhere(todos, {id: todoID});

		if (matchedTodo) {
			res.json(matchedTodo);
		} else {
			res.status(404).send();
		}
	}
);

// POST /todos
app.post('/todos', 
	function(req, res) {
		var body = _.pick(req.body, "description", "completed");

		if (!_.isBoolean(body.completed) || !_.isString(body.description) 
				|| body.description.trim().length ==- 0) {
			return res.status(400).send();
		}

		body.description = body.description.trim();
		body.id = todoNextID++;
		todos.push(body);
		res.json(body);
	}
);

// DELETE /todos/:id
app.delete('/todos/:id', 
	function(req, res) {
		var todoID = parseInt(req.params.id, 10);
		
		var matchedTodo = _.findWhere(todos, {id: todoID});

		if (matchedTodo) {
			todos = _.without(todos, matchedTodo);	
			res.status(200).json(matchedTodo);
		} else {
			res.status(404).send();
		}
	}
);

// PUT
app.put('/todos/:id', 
	function(req, res) {
		var todoID = parseInt(req.params.id, 10);
		var matchedTodo = _.findWhere(todos, {id: todoID});

		if (!matchedTodo) {
			return res.status(404).send();
		}

		var body = _.pick(req.body, "description", "completed");
		var validatedAttributes = {};

		if (body.hasOwnProperty("completed") && _.isBoolean(body.completed)) {
			validatedAttributes.completed = body.completed;
		} else if (body.hasOwnProperty("completed")) {
			return res.status(400).send();
		}

		if (body.hasOwnProperty("description") && _.isString(body.description)
			&& body.description.trim().length > 0) {
			validatedAttributes.description = body.description;
		} else if (body.hasOwnProperty("description")) {
			return res.status(400).send();
		}


		_.extend(matchedTodo, validatedAttributes);
		res.json(matchedTodo);
	}
);

app.listen(PORT, 
	function() {
		console.log("Express listening on port " + PORT + "!");
	}
);