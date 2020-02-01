const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
const url = process.env.MONGODB_URI;
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('connected to MongoDB');
    })
    .catch((error) => {
        console.log('error connecting to MongoDB', error.message);
    });

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: [3, 'name must be at least 3 characters long'],
        required: [true, 'name missing'],
        unique: [true, 'name must be unique']
    },
    number: {
        type: String,
        minlength: [8, 'number must be at least 8 characters long'],
        required: [true, 'number missing']
    }
});

personSchema.plugin(uniqueValidator);

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject._v;
    }
});

module.exports = mongoose.model('Person', personSchema);