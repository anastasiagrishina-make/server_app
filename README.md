# Endpoints Documentation

Database: PostgreSQL

## GET /tasks
Returns a list of tasks.

**Query Parameters**

| Parameter  | Required | Description | Usage |
| ------------- | ------------- | ------------- | ------------- |
| author  | optional  | Filter tasks by author.  | Can be a single value (e.g. `John`) or multiple values separated by colons (e.g. `John:Doe`).  |
| name | optional  |  Filter tasks by name.  |  Can be a single value or multiple values separated by colons `:`. |
| description  | optional  |   Filter tasks by description.  | Can be a single value or multiple values separated by colons `:`.  |
| search  | optional  |  Search for tasks by name, description or author.  | Searches for tasks that contain the specified string in their name, description, or author's full name (combination of first and last name).  |
| sort_by  | optional  |  Sorts tasks by the specified field.   | Use a minus sign (-) before the field name to sort in descending order.  |

## Notes:
The search parameter performs a case-insensitive search by default.
The author parameter accepts either the full name (e.g. `John Doe`) or separate first and last names (e.g. `John:Doe`).

## Example Requests:

Retrieves all tasks.
```
GET /tasks
```
Retrieves all tasks that have the word "important" in their name or description or author.
```
GET /tasks?search=important
```
Retrieves all tasks that have either "John" or "Yana" as the author.
```
GET /tasks?author=John:Yana
```
Retrieves all tasks that have "John" as the author and "TODO" in their name.
```
GET /tasks?author=John&name=TODO
```
Retrieves all tasks that have "important" in their name sorted by createdAt in descending order.
```
GET /tasks?name=important&sort_by=-createdAt
```

## Response:
```HTTP
[
  {
    "id": 1,
    "name": "Task1",
    "description": "This is a description",
    "createdAt": "2023-03-01T12:00:00.000Z",
    "modifiedAt": "2023-03-01T12:00:00.000Z",
    "author": 
      { 
        "id": 1,   
        "firstname": "John",
        "lastname": "Doe"
       }
   },
   {
    "id": 2,
    "name": "Task2",
    "description": "This is a description",
    "createdAt": "2023-03-01T12:00:00.000Z",
    "modifiedAt": "2023-03-01T12:00:00.000Z",
    "author": 
      { 
        "id": 1,
        "firstname": "John",
        "lastname": "Doe"
       }
   }
 ]

```

## Error Responses:

**500 Internal Server Error:** Returned when the query execution fails.
