// Set up
var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var cors = require('cors');
const e = require('express');

const options = { 
    reconnectTries: 30, 
    reconnectInterval: 500, 
    poolSize: 1, 
    socketTimeoutMS: 2000000, 
    keepAlive: true 
};
mongoose.set('strictQuery', false);
// Configuration
//mongoose.connect("mongodb+srv://tm:1234@schedule-with-colors.frqd9lu.mongodb.net/test", options);
mongoose.connect("mongodb+srv://tm:1234@schedule-with-colors.frqd9lu.mongodb.net/test");


app.use(bodyParser.urlencoded({'extended': 'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({type: 'application/vnd.api+json'}));
app.use(methodOverride());
app.use(cors());

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'DELETE, POST, PUT');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

var Category = mongoose.model('Category', {
    name: String,
    color: String,
    defaultTime: Date,
});

var Assignment = mongoose.model('Assignment', {
    name: String,
    description: String,
    isDueDateUncertain: Boolean,
    isCompleted: Boolean,
    dueDate: Date,
    categoryId: String
});

//Categories//////////////////////////////////////////////////
app.get('/api/categories', function (req, res) {
    Category.find(function (err, categories) {
        if (err) {
            res.send(err);
        }
        res.json(categories); 
    });
});

app.post('/api/categories', function (req, res) {
    Category.create({
        name: req.body.name,
        color: req.body.color,
        defaultTime: req.body.defaultTime
    }, function (err, category) {
        if (err) {
            res.send(err);
        }
        else{
            res.send();
        }
    });
});

app.put('/api/categories/:id', function (req, res) {
    Category.update({_id: req.params.id}, {
        name: req.body.name,
        color: req.body.color,
        defaultTime: req.body.defaultTime
    }, function (err, raw) {
        if (err) {
            res.send(err);
        }
        res.send(raw);
    });
});

app.delete('/api/categories/:id', function (req, res) {
    Category.remove({
        _id: req.params.id
    }, function (err) {
        if (err) {
            console.error("Error deleting category ", err);
        }else{
            Assignment.remove({
                categoryId: req.params.id
            }, function (err) {
                if (err) {
                    console.error("Error deleting category ", err);
                }else{
                    res.send(null);
                }
            })
            
        }
    });
});


//Assignments/////////////////////////////////////////
app.get('/api/assignments', function (req, res) {
    Assignment.find(function (err, assignments) {
        if (err) {
            res.send(err);
        }
        res.json(assignments); 
    });
});

app.get('/api/assignments/:id', function (req, res) {
    Assignment.find({_id: req.params.id}, function (err, assignments) {
        if (err) {
            res.send(err);
        }
        res.json(assignments); 
    });
});

app.post('/api/assignments', function (req, res) {
    Assignment.create({
        name: req.body.name,
        description: req.body.description,
        isDueDateUncertain: req.body.isDueDateUncertain,
        dueDate: req.body.dueDate,
        categoryId: req.body.categoryId,
        isCompleted: req.body.isCompleted
    }, function (err) {
        if (err) {
            res.send(err);
        }
        res.send();
    });
});

app.put('/api/assignments/:id', function (req, res) {
    const assignment = {
        name: req.body.name,
        description: req.body.description,
        isDueDateUncertain: req.body.isDueDateUncertain,
        dueDate: req.body.dueDate,
        categoryId: req.body.categoryId,
        isCompleted: req.body.isCompleted
    };
    Assignment.update({_id: req.params.id}, assignment, function (err, raw) {
        if (err) {
            res.send(err);
        }
        res.send(raw);
    });
});

app.delete('/api/assignments/:id', function (req, res) {
    Assignment.remove({
        _id: req.params.id
    }, function (err) {
        if (err) {
            console.error("Error deleting assignment", err);
        }else{
            res.send(null);
        }
    });
});

app.delete('/api/assignments', function (req, res) {
    Assignment.deleteMany({
        isCompleted: true
    }, function (err) {
        if (err) {
            console.error("Error deleting assignments", err);
        }else{
            res.send(null);
        }
    });
});

app.listen(process.env.PORT || 8080);
console.log("Server listening on port  - ", (process.env.PORT || 8080));