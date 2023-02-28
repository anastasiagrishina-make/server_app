import mongoose from 'mongoose';

const {Schema, model} = mongoose;

const authorSchema = new Schema({
    firstname: {type: String, required: 'author.firstname - is required.'},
    lastname: {type: String, required: 'author.lastname - is required.'},
}, {
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'modifiedAt'
    },
    versionKey: false
});

const taskSchema = new Schema({

    name: {type: String, required: 'name - is required.'},
    description: String,
    author: {type: [authorSchema], required: 'author object - is required.'},
}, {
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'modifiedAt'
    },
    versionKey: false
});

const Author = model('Author', authorSchema);
const Task = model('Task', taskSchema);
export {Author, Task};