const { Op } = require('sequelize');
const { Item } = require('../models');

// Create a new Item
exports.createItem = async (req, res, next) => {
  try {
    const { title, description, category, status, priority } = req.body;

    if (!title || title.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Title is required',
      });
    }

    const newItem = await Item.create({
      title: title.trim(),
      description: description ? description.trim() : null,
      category: category ? category.trim() : 'General',
      status: status || 'pending',
      priority: priority || 'medium',
    });

    return res.status(201).json({
      success: true,
      message: 'Item created successfully',
      data: newItem,
    });
  } catch (error) {
    next(error);
  }
};

// Get all Items (with optional filter by status, category, priority, and search query)
exports.getAllItems = async (req, res, next) => {
  try {
    const { status, category, priority, search } = req.query;
    const whereClause = {};

    if (status) {
      whereClause.status = status;
    }

    if (category) {
      whereClause.category = category;
    }

    if (priority) {
      whereClause.priority = priority;
    }

    if (search) {
      whereClause[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const items = await Item.findAll({
      where: whereClause,
      order: [['createdAt', 'DESC']],
    });

    return res.status(200).json({
      success: true,
      count: items.length,
      data: items,
    });
  } catch (error) {
    next(error);
  }
};

// Get a single Item by ID
exports.getItemById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await Item.findByPk(id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: `Item with id ${id} not found`,
      });
    }

    return res.status(200).json({
      success: true,
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

// Update an Item by ID
exports.updateItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, category, status, priority } = req.body;

    const item = await Item.findByPk(id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: `Item with id ${id} not found`,
      });
    }

    if (title !== undefined) item.title = title.trim();
    if (description !== undefined) item.description = description ? description.trim() : null;
    if (category !== undefined) item.category = category ? category.trim() : item.category;
    if (status !== undefined) item.status = status;
    if (priority !== undefined) item.priority = priority;

    await item.save();

    return res.status(200).json({
      success: true,
      message: 'Item updated successfully',
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

// Delete an Item by ID
exports.deleteItem = async (req, res, next) => {
  try {
    const { id } = req.params;

    const item = await Item.findByPk(id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: `Item with id ${id} not found`,
      });
    }

    await item.destroy();

    return res.status(200).json({
      success: true,
      message: `Item with id ${id} deleted successfully`,
    });
  } catch (error) {
    next(error);
  }
};
