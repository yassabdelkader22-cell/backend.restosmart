const Restaurant = require('../models/restaurant.model');


// ==================== GET ALL RESTAURANTS ====================
exports.getAllRestaurants = async (req, res) => {
    try {
        const restaurants = await Restaurant.find();
        res.status(200).json(restaurants);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ==================== GET RESTAURANT BY ID ====================
exports.getRestaurantById = async (req, res) => {
    try {
        const { id } = req.params;
        const restaurant = await Restaurant.findById(id);
        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant non trouvé' });
        }
        res.status(200).json(restaurant);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ==================== GET RESTAURANTS BY LOCATION ====================
exports.getRestaurantsByLocation = async (req, res) => {
    try {
        const { location } = req.params;
        const restaurants = await Restaurant.find({ 
            location: { $regex: location, $options: 'i' } 
        });
        res.status(200).json(restaurants);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ==================== GET RESTAURANT PROFILE ====================
exports.getRestaurantProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const restaurant = await Restaurant.findById(id)
            .populate('products')
            .populate('tables')
            .populate('groups')
            .populate('workers')
            .populate('manager')
            .populate('categories')
            .populate('comments')
            .populate('owner');
        
        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant non trouvé' });
        }
        res.status(200).json(restaurant);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};