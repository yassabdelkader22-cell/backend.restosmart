const express = require('express');
const router = express.Router();
const tableController = require('../controllers/table.controller');

// إدارة الطاولات
router.post('/table/:managerId/:restaurantId', tableController.addTable);
router.get('/tables', tableController.getAllTables);
router.get('/tables/restaurant/:restaurantId', tableController.getTablesByRestaurant);
router.get('/table/:tableId', tableController.getTableById);
router.put('/table/:tableId/status', tableController.updateTableStatus);
router.delete('/table/:tableId', tableController.deleteTable);
// إضافة طاولات متعددة
router.post('/tables/batch/:managerId/:restaurantId', tableController.addMultipleTables);

// حذف طاولات متعددة
router.delete('/tables/batch/:restaurantId', tableController.deleteMultipleTables);
router.get('/table/qrcode/:restaurantId/:tableNumero', tableController.getQRCodeByTableNumber);


// صفحة المنيو (عند مسح QR Code)
router.get('/menu/:restaurantId/:tableNumero', tableController.getMenuByTable);

// إدارة السلة
router.post('/cart/:tableId/add', tableController.addToCart);
router.delete('/cart/:tableId/remove/:productId', tableController.removeFromCart);
router.put('/cart/:tableId/update/:productId', tableController.updateCartQuantity);
router.get('/cart/:tableId', tableController.getCartByTable);
router.delete('/cart/:tableId/clear', tableController.clearCart);
router.get('/table/:tableId/qr-code', tableController.getQRCodeImage);


module.exports = router;