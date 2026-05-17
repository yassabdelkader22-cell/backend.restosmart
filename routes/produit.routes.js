const express = require('express');
const router = express.Router();
const productController = require('../controllers/produit.controllers');

router.get('/products/category/:restaurantId/:categorie', productController.getProductsByCategory);

module.exports = router;
