const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurent.controllers') ; // ✅ restaurant (صحيح)

// ==================== RESTAURANT ROUTES ====================

router.get('/restaurants', restaurantController.getAllRestaurants);
router.get('/restaurant/:id', restaurantController.getRestaurantById);
router.get('/restaurants/location/:location', restaurantController.getRestaurantsByLocation);
router.get('/restaurant/profile/:id', restaurantController.getRestaurantProfile);

module.exports = router;
