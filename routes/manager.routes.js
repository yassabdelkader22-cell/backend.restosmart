const express = require('express');
const router = express.Router();
const managerController = require('../controllers/manager.conroller');

// تحديث معلومات المطعم
router.put('/restaurant-info/:restaurantId', managerController.updateRestaurantInfo);

// جلب مطعم المدير
router.get('/manager-restaurant/:managerId', managerController.getRestaurantByManagerId);

module.exports = router;