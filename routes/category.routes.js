const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');

router.get('/categories', categoryController.getCategories);
router.get('/category/:id', categoryController.getCategoryById);

module.exports = router;