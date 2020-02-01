require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/person');

app.use(express.static('build'));
app.use(express.json());
app.use(bodyParser.json());
app.use(morgan(function (tokens, req, res) {
    if (tokens.method(req, res) === 'POST') {
        return [
            tokens.method(req, res),
            tokens.url(req, res),
            tokens.status(req, res),
            tokens.res(req, res, 'content-length'), '-',
            tokens['response-time'](req, res), 'ms',
            JSON.stringify(req.body)
        ].join(' ');
    }
    return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms'
    ].join(' ');
}));
app.use(cors());

app.get('/', (req, res) => {
    res.redirect('/api/persons');
});

app.get('/info', (req, res) => {
    let people = 0;
    Person.find({}).then(result => {
        people = result.length;
        res.send(
            `
            <div>Phonebook has info for ${people} people</div>
            <div>${new Date()}</div>
            `
        );
    });
});

app.get('/api/persons', (req, res) => {
    Person.find({}).then(result => {
        let persons = result.map(person => person.toJSON());
        res.json(persons);
    });
});

app.get('/api/persons/:id', (req, res, next) => {
    Person.findById(req.params.id).then(person => {
        if (person) {
            res.json(person.toJSON());
        } else {
            res.status(404).send({ error: 'id does not exist' });
        }
    })
        .catch(error => next(error));
});

app.delete('/api/persons/:id', (req, res, next) => {
    Person.findByIdAndDelete(req.params.id).then(() => {
        res.status(204).end();
    })
        .catch(error => next(error));
});

app.post('/api/persons', (req, res, next) => {
    const body = req.body;

    const person = new Person({
        name: body.name,
        number: body.number
    });

    person.save().then(savedPerson => {
        res.json(savedPerson.toJSON());
    }).catch(error => next(error));

});

app.put('/api/persons/:id', (req, res, next) => {
    const body = req.body;
    const id = req.params.id;
    Person.findById(id).then(result => {
        if (!result) {
            return res.status(400).json({
                error: 'id does not exist'
            });
        }
        const number = body.number;

        Person.findByIdAndUpdate(id, { number: number }).then(person => {
            res.json(person.toJSON());
        });
    })
        .catch(error => next(error));
});

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' });
};

app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
    console.error(error.message);

    if (error.name === 'CastError' && error.kind === 'ObjectId') {
        return response.status(400).send({ error: 'malformatted id' });
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message });
    }

    next(error);
};
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}, http://localhost:3001`);
});