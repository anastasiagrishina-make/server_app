import mongoose from 'mongoose';
import AuthorSchema from './author.js'

const {Schema, model} = mongoose;

const taskSchema = new Schema({

    name: {type: String, required: 'name - is required.'},
    description: String,
    author: {type: AuthorSchema.schema, required: 'author object - is required.' },
}, {
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'modifiedAt'
    },
    versionKey: false
});

const Task = model('Task', taskSchema);
export default Task;