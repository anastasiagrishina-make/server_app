import {Author, Task} from "../models/task_mongodb.js";


//List
const listTasks = async (req, res) => {
    const query = req.query.q
    const sort_by = req.query["sort_by"]
    const {author, name, description} = req.query


    function regexArray(array) {
        if (array.length < 1) return ""
        return array.map(item => `^${item}$`).join('|')
    }

    function splitText(text) {
        return text ? text.split(':') : []
    }


    try {
        //Basic List
        if (!(query && author && name && description)) {
            return res.send(await Task.find({}).sort(sort_by))
        }

        //Filter and search logic
        const authorArr = splitText(author);
        const namesArr = splitText(name);
        const descriptionArr = splitText(description);

        const tasks = await Task.aggregate([
                {
                    $addFields: {
                        authorFilter: {
                            $concat: ["$author.firstname", " ", "$author.lastname"],
                        },
                    }
                },
                {
                    $match: {
                        $or: [
                            {name: {"$regex": query, "$options": "i"}},
                            {description: {"$regex": query, "$options": "i"}}
                        ],
                        authorFilter: {
                            "$regex": regexArray(authorArr),
                            "$options": "i"
                        },
                        name: {
                            "$regex": regexArray(namesArr),
                            "$options": "i"
                        },
                        description: {
                            "$regex": regexArray(descriptionArr),
                            "$options": "i"
                        }
                    }
                }
            ]
        ).sort(sort_by);

        res.send(tasks);
    } catch
        (error) {
        res.status(500).send(error);
    }
};

const listAuthors = async (req, res) => {
    const query = req.query.q
    const sort_by = req.query["sort_by"]
    const {firstname, lastname} = req.query

    function regexArray(array) {
        if (array.length < 1) return ""
        return array.map(item => `^${item}$`).join('|')
    }

    function splitText(text) {
        return text ? text.split(':') : []
    }


    try {
        //Basic List
        if (!query && !firstname && !lastname) {
            return res.send(await Author.find({}).sort(sort_by))
        }

        //Filter and search logic
        const firstnameArr = splitText(firstname);
        const lastnameArr = splitText(lastname);

        const tasks = await Author.aggregate([
                {
                    $addFields: {
                        authorFilter: {
                            $concat: ["$author.firstname", " ", "$author.lastname"],
                        },
                    }
                },
                {
                    $match: {
                        authorFilter: {
                            "$regex": query,
                            "$options": "i"
                        },
                        firstname: {
                            "$regex": regexArray(firstnameArr),
                            "$options": "i"
                        },
                        lastname: {
                            "$regex": regexArray(lastnameArr),
                            "$options": "i"
                        }
                    }
                }
            ]
        ).sort(sort_by);

        res.send(tasks);
    } catch
        (error) {
        res.status(500).send(error);
    }
};

//Get
const getTask = async (req, res) => {
    const {id} = req.params;

    try {
        const found = await Task.findById(id)
        res.send(found || {message: "Task isn't found"});
    } catch (error) {
        res.status(500).send(error);
    }
};

//Create
const createTask = async (req, res) => {
    const task = new Task(req.body);
    const author = req.body.author;
    const item = task;

    try {
        //If author doesn't exist, create one. Else, display existing.
        let updatedAuthor = await Author.updateOne(author, author, {upsert: true, strict: true, new: true});
        item['author'] = await Author.findOne((updatedAuthor.upsertedId) ? updatedAuthor.upsertedId : author);

        await Task.create(item);
        res.send(item);
    } catch (error) {
        res.status(500).send(error);
    }
};

//Update
const updateTask = async (req, res) => {
    const task = req.body;
    const author = new Author(task.author);
    const {id} = req.params;

    try {
        if (task.author && !task.author._id && (!task.author.firstname || !task.author.lastname)) {
            return res.send({message: "Author ID, or firstname and lastname for a new author, are required"});
        }

        const found = await Task.findByIdAndUpdate(id, task, {returnDocument: "after"});

        if (task.author) {
            const updatedAuthor = task.author._id ?
                await Author.findByIdAndUpdate(task.author._id) :
                await Author.updateOne(task.author, author, {
                    upsert: true,
                    strict: true,
                    new: true,
                    runValidators: true
                });

            found['author'] = updatedAuthor.upsertedId ? await Author.findOne(updatedAuthor.upsertedId) : updatedAuthor
        }

        res.send(found);
    } catch (error) {
        res.status(500).send(error);
    }
};

//Delete
const deleteTask = async (req, res) => {
    const {id} = req.params;

    try {
        await Task.findByIdAndDelete(id)
        res.send();
    } catch (error) {
        res.status(500).send(error);
    }
};

export {
    listTasks,
    listAuthors,
    getTask,
    createTask,
    updateTask,
    deleteTask
};