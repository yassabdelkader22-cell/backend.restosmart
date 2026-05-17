const express = require('express');
const router = express.Router();
const groupeController = require('../controllers/groupe.controller');

// إدارة المجموعات
router.post('/groupe/:restaurantId', groupeController.addGroupe);
router.put('/groupe/add-tables/:groupeId', groupeController.addTablesToGroupeByRange);
router.get('/groupes/:restaurantId', groupeController.getGroupesByRestaurant);
router.get('/groupe/:groupeId', groupeController.getGroupeById);
router.put('/groupe/:groupeId', groupeController.updateGroupe);
router.delete('/groupe/:groupeId', groupeController.deleteGroupe);
router.get('/groupe/tables/:groupeId', groupeController.getTablesByGroupe);
router.get('/groupe/stats/:groupeId', groupeController.getGroupeStats);

module.exports = router;