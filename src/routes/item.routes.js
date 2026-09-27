const express = require('express');
const router = express.Router();
const itemController = require('../controllers/item.controller');

// @route   GET /api/items
// @desc    Get all items (with optional filters)
// @route   POST /api/items
// @desc    Create a new item
router.route('/')
  .get(itemController.getAllItems)
  .post(itemController.createItem);

// @route   GET /api/items/:id
// @desc    Get a single item by id
// @route   PUT /api/items/:id
// @desc    Update an item by id
// @route   DELETE /api/items/:id
// @desc    Delete an item by id
router.route('/:id')
  .get(itemController.getItemById)
  .put(itemController.updateItem)
  .delete(itemController.deleteItem);

module.exports = router;
