const Restaurant = require('../models/restaurant.model');
const Manager = require('../models/manager.model');
const fs = require('fs');
const path = require('path');

// ==================== UPDATE RESTAURANT INFO ====================
exports.updateRestaurantInfo = async (req, res) => {
    try {
        const { restaurantId } = req.params;
        const { name, location, description, phone, email, openingHours, address } = req.body;

        const restaurant = await Restaurant.findById(restaurantId);
        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant non trouvé' });
        }

        if (name) restaurant.name = name;
        if (location) restaurant.location = location;
        if (description) restaurant.description = description;
        if (phone) restaurant.phone = phone;
        if (email) restaurant.email = email;
        if (openingHours) restaurant.openingHours = openingHours;
        if (address) restaurant.address = address;

        const uploadDir = path.join(__dirname, '..', 'uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        if (req.files) {
            if (req.files.logo) {
                const logoFile = req.files.logo;
                if (logoFile.mimetype.startsWith('image/')) {
                    const timestamp = Date.now();
                    const random = Math.round(Math.random() * 1E9);
                    const ext = logoFile.name.split('.').pop();
                    const logoName = `logo-${restaurantId}-${timestamp}-${random}.${ext}`;
                    await logoFile.mv(path.join(uploadDir, logoName));
                    restaurant.logo = `http://localhost:5001/uploads/${logoName}`;
                }
            }

            if (req.files.image) {
                const imageFile = req.files.image;
                if (imageFile.mimetype.startsWith('image/')) {
                    const timestamp = Date.now();
                    const random = Math.round(Math.random() * 1E9);
                    const ext = imageFile.name.split('.').pop();
                    const imageName = `image-${restaurantId}-${timestamp}-${random}.${ext}`;
                    await imageFile.mv(path.join(uploadDir, imageName));
                    restaurant.image = `http://localhost:5001/uploads/${imageName}`;
                }
            }
        }

        await restaurant.save();

        res.status(200).json({
            message: 'Informations du restaurant mises à jour avec succès',
            restaurant
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ==================== GET RESTAURANT BY MANAGER ID ====================
exports.getRestaurantByManagerId = async (req, res) => {
    try {
        const { managerId } = req.params;
        
        const manager = await Manager.findById(managerId);
        if (!manager) {
            return res.status(404).json({ message: 'Manager non trouvé' });
        }

        const restaurant = await Restaurant.findById(manager.restaurant);
        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant non trouvé' });
        }

        res.status(200).json(restaurant);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};