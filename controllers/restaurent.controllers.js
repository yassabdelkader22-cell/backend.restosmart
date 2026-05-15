const Restaurant = require('../models/restaurant.model');
const Manager = require('../models/manager.model');
const Category = require('../models/category.model');

// ==================== GET ALL RESTAURANTS ====================
module.exports.getAllRestaurants = async () => {
    try {
        const restaurants = await Restaurant.find();
        return restaurants;
    } catch (error) {
        throw new Error(error.message);
    }
};

// ==================== GET RESTAURANT BY ID ====================
module.exports.getRestaurantById = async (id) => {
    try {
        const restaurant = await Restaurant.findById(id);
        if (!restaurant) {
            throw new Error('Restaurant non trouvé');
        }
        return restaurant;
    } catch (error) {
        throw new Error(error.message);
    }
};

// ==================== GET RESTAURANTS BY LOCATION ====================
module.exports.getRestaurantsByLocation = async (location) => {
    try {
        const restaurants = await Restaurant.find({ 
            location: { $regex: location, $options: 'i' } 
        });
        return restaurants;
    } catch (error) {
        throw new Error(error.message);
    }
};

// ==================== GET RESTAURANT PROFILE ====================
module.exports.getRestaurantProfile = async (id) => {
    try {
        const restaurant = await Restaurant.findById(id)
            .populate('products')
            .populate('tables')
            .populate('groups')
            .populate('workers')
            .populate('manager');
        
        if (!restaurant) {
            throw new Error('Restaurant non trouvé');
        }
        return restaurant;
    } catch (error) {
        throw new Error(error.message);
    }
};

// ==================== GET RESTAURANT CATEGORIES ====================
module.exports.getRestaurantCategories = async (id) => {
    try {
        const categories = await Category.find({ restaurant: id });
        return categories;
    } catch (error) {
        throw new Error(error.message);
    }
};

// ==================== UPDATE RESTAURANT ====================
module.exports.updateRestaurant = async (id, dto) => {
    try {
        const restaurant = await Restaurant.findById(id);
        if (!restaurant) {
            throw new Error('Restaurant non trouvé');
        }

        if (dto.name) restaurant.name = dto.name;
        if (dto.address) restaurant.address = dto.address;
        if (dto.phone) restaurant.phone = dto.phone;
        if (dto.email) restaurant.email = dto.email;
        if (dto.image) restaurant.image = dto.image;
        if (dto.logo) restaurant.logo = dto.logo;
        if (dto.openingHours) restaurant.openingHours = dto.openingHours;
        if (dto.description) restaurant.description = dto.description;
        if (dto.location) restaurant.location = dto.location;

        await restaurant.save();
        return restaurant;
    } catch (error) {
        throw new Error(error.message);
    }
};