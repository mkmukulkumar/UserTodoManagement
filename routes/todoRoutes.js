// routes/todoRoutes.js

const express = require('express');
const router = express.Router();
const TodoController = require('../controllers/TodoController.js');
const gettodo = require('../middleware/gettodo.js');

/**
 * @swagger
 * tags:
 *   name: Todos
 *   description: Todo API endpoints
 */

/**
 * @swagger
 * /api/todos:
 *   post:
 *     summary: Create a new Todo
 *     tags: [Todos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              type: object
 *              properties:
 *                  title:
 *                      type: string
 *                      description: Title of the todo
 *                  description:
 *                      type: string
 *                      description: Description of the todo
 *             
 *     responses:
 *       '200':
 *         description: Todo created successfully
 *       '400':
 *         description: Bad request
 *       '500':
 *         description: Internal server error
 */
router.post('/', TodoController.createTodo);

/**
 * @swagger
 * /api/todos:
 *   get:
 *     summary: Get all Todos
 *     tags: [Todos]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: Filter by title (case-insensitive)
 *     responses:
 *       '200':
 *         description: List of Todos
 *       '400':
 *         description: Bad request
 *       '500':
 *         description: Internal server error
 */

router.get('/', TodoController.getTodo);

/**
 * @swagger
 * /api/todos/{id}:
 *   get:
 *     summary: Get a single Todo by ID
 *     tags: [Todos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Todo ID
 *     responses:
 *       '200':
 *         description: Todo found
 *       '404':
 *         description: Todo not found
 *       '500':
 *         description: Internal server error
 */
router.get('/:id',gettodo, TodoController.getSingleTodo);

/**
 * @swagger
 * /api/todos/{id}:
 *   patch:
 *     summary: Update a Todo by ID
 *     tags: [Todos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Todo ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: New title of the todo
 *               description:
 *                 type: string
 *                 description: New description of the todo
 *     responses:
 *       '200':
 *         description: Todo updated successfully
 *       '404':
 *         description: Todo not found
 *       '500':
 *         description: Internal server error
 */
router.patch('/:id', gettodo, TodoController.updateTodo);

/**
 * @swagger
 * /api/todos/{id}:
 *   delete:
 *     summary: Delete a Todo by ID
 *     tags: [Todos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Todo ID
 *     responses:
 *       '200':
 *         description: Todo deleted successfully
 *       '404':
 *         description: Todo not found
 *       '500':
 *         description: Internal server error
 */
router.delete('/:id', gettodo, TodoController.deleteTodo);

module.exports = router;
