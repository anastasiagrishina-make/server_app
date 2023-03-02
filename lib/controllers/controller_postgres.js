import {db} from "../databases/postgreSQL.js"

//List
const listTasks_Postgres = async (req, res) => {
    const {author, name, description, search, sort_by} = req.query;

    let query = `SELECT id,name,description,"createdAt","modifiedAt",author FROM task_view WHERE 1 = 1 `;
    let values = [];

    try {
        //Functions:
        function buildFilterClause(param, columnName, operator, values, query, logic) {
            const paramArr = param.split(':');
            if (paramArr.length === 1) {
                query += ` ${logic || 'AND'} LOWER(${columnName}) ${operator} LOWER($${values.length + 1})`;
                values.push(paramArr[0].toLowerCase());
            } else if (paramArr.length > 1) {
                const placeholders = paramArr.map((_, i) => `$${values.length + i + 1}`).join(', ');
                query += ` ${logic || 'AND'} LOWER(${columnName}) IN (${placeholders})`;
                values.push(...paramArr.map(p => p.toLowerCase()));
            }
            return {query, values};
        }


        // Search logic
        if (search) {
            query += `AND (name ILIKE $1 OR description ILIKE $1 OR CONCAT_WS(' ', author->>'firstname', author->>'lastname') ILIKE $1)`;
            values.push(`%${search}%`);
        }

        // Filter logic
        if (author) {
            if (author.split(' ').length > 1) {
                ({query,values} = buildFilterClause(author, "CONCAT_WS(' ', author->>'firstname', author->>'lastname')", "=", values, query));
            } else {
                ({query, values} = buildFilterClause(author, "author.'firstname'", "=", values, query));
                ({query, values} = buildFilterClause(author, "author->>'lastname'", "=", values, query, 'OR'));
            }
        }

        if (name) {
            ({query, values} = buildFilterClause(name, "name", "=", values, query));
        }

        if (description) {
            ({query, values} = buildFilterClause(description, "description", "=", values, query));
        }


        // Sorting logic
        if (sort_by) {
            const order = sort_by.startsWith("-") ? "DESC" : "ASC";
            const field = sort_by.replace(/^-/, "");
            query += ` ORDER BY "${field}" ${order}`;
        }


        const {rows} = await db.query(query, values);

        res.status(200).json(rows);
    } catch (error) {
        console.log('Query executed before error:')
        console.log(`Query: 
        ${query}`)
        console.log(`Values used: 
        ${values}`)
        res.status(500).send(error);
    }
};


const listAuthors_Postgres = async (req, res) => {
    try {
        const {rows} = await db.query('SELECT id,firstname,lastname,"createdAt","modifiedAt" FROM authors');
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).send(error);
    }
};

//Get
const getTask_Postgres = async (req, res) => {
    const {id} = req.params;

    try {
        const {
            rows,
            rowCount
        } = await db.query(`SELECT id,name,description,"createdAt","modifiedAt",author FROM task_view WHERE id=$1`, [id]);
        rowCount === 0 ? res.status(404).json({message: "Task isn't found"}) : res.status(200).json(rows[0]);
    } catch (error) {
        res.status(500).send(error);
    }
};

//Create
const createTask_Postgres = async (req, res) => {
    const {name, description, author} = req.body;
    let authorId;

    try {
        if (!author.id && (!author.firstname || !author.lastname)) {
            return res.status(400).send({message: "Author ID, or firstname and lastname for a new author, are required"});
        }

        //Author data is provided
        if (author.id) {
            const {rowCount} = await db.query(`SELECT id FROM authors WHERE id=$1`, [author.id]);
            authorId = rowCount !== 0 ? author.id : null;
        } else if (author.firstname && author.lastname) {
            const {rows} = await db.query(`SELECT id FROM authors WHERE firstname=$1 AND lastname=$2`, [author.firstname, author.lastname]);
            authorId = rows.length !== 0 ? rows[0].id : null;
        }

        //No author data - create an author
        if (!authorId) {
            const {rows} = await db.query(`INSERT INTO authors(firstname, lastname) VALUES ($1, $2) RETURNING id`, [author.firstname, author.lastname]);
            authorId = rows[0].id;
        }

        // Create a task and update author's "modifiedAt"
        const {rows} = await db.query(`INSERT INTO tasks(name, description, author) VALUES ($1, $2, $3) RETURNING id`, [name, description, authorId]);
        await db.query(`UPDATE authors SET "modifiedAt" = NOW() WHERE id=$1`, [authorId]);
        const insertedTask = rows[0].id

        // Return the updated task
        const {rows: taskRows} = await db.query(`SELECT id,name,description,"createdAt","modifiedAt",author FROM task_view WHERE id=$1`, [insertedTask]);
        res.status(201).json(taskRows[0]);


    } catch (error) {
        res.status(500).send(error);
    }

};

//Update
const updateTask_Postgres = async (req, res) => {
    const {id} = req.params;
    const task = req.body;
    const author = task.author;


    try {
        if (task.author && !task.author.id && (!task.author.firstname || !task.author.lastname)) {
            return res.send({message: "Author ID, or firstname and lastname for a new author, are required"});
        }

        // Retrieve the task from the database
        const {rows: [existingTask]} = await db.query('SELECT * FROM task_view WHERE id = $1', [id]);
        console.log(existingTask)

        if (!existingTask) {
            return res.status(404).send({message: "Task not found"});
        }

        const updateColumns = [];
        const updateValues = {};

        if (task.name) {
            updateColumns.push('name');
            updateValues['name'] = `'${task.name}'`;
        }

        if (task.description) {
            updateColumns.push('description');
            updateValues['description'] = `'${task.description}'`;
        }

        let authorId;
        if (author) {
            if (author.id) {
                // Check if the author with the provided ID exists
                const {rowCount} = await db.query('SELECT * FROM authors WHERE id = $1', [author.id]);

                if (rowCount === 0) {
                    return res.status(404).send({message: `Author with ID ${author.id} not found`});
                }

                authorId = author.id;
            } else {
                //check if author exists
                const {rows: [existingAuthor]} = await db.query(
                    'SELECT id FROM authors WHERE firstname = $1 AND lastname = $2',
                    [author.firstname, author.lastname]
                );
                authorId = existingAuthor ? existingAuthor.id : null;

                if (!existingAuthor) {
                    //create new author
                    const {rows: [newAuthor]} = await db.query(
                        'INSERT INTO authors (firstname, lastname) VALUES ($1, $2) RETURNING id',
                        [author.firstname, author.lastname]
                    );
                    authorId = newAuthor.id;
                }
            }

            if (authorId) {
                updateColumns.push('author');
                updateValues['author'] = `'${authorId}'`;
            }
        }

        // Add "modifiedAt" to the update columns
        updateColumns.push('"modifiedAt"');
        updateValues['"modifiedAt"'] = 'NOW()';

        // Build the SQL update statement
        const updateTaskSql = `UPDATE tasks SET ${updateColumns.map((c) => `${c} = ${updateValues[c]}`).join(', ')} WHERE id = ${id}`;

        // Update the task and author's "modifiedAt"
        await db.query(updateTaskSql);

        // Return the updated task
        const {rows: [updatedRow]} = await db.query('SELECT * FROM task_view WHERE id = $1', [id]);
        res.status(200).json(updatedRow);

    } catch (error) {
        res.status(500).send(error);
    }

};

//Delete
const deleteTask_Postgres = async (req, res) => {
    const {id} = req.params;

    try {
        // Check if the task exists
        const {rowCount} = await db.query('SELECT * FROM tasks WHERE id = $1', [id]);
        if (rowCount === 0) {
            return res.status(404).send({message: `Task with id=${id} not found`});
        }

        // Delete the task
        await db.query('DELETE FROM tasks WHERE id = $1', [id]);

        res.status(204).send();
    } catch (error) {
        res.status(500).send(error);
    }
};

export {
    listTasks_Postgres,
    listAuthors_Postgres,
    getTask_Postgres,
    createTask_Postgres,
    updateTask_Postgres,
    deleteTask_Postgres
};