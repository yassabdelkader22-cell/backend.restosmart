const Product = require('../models/produit.model');
const Restaurant = require('../models/restaurant.model');

// ==================== GET PRODUCTS BY CATEGORY ====================
exports.getProductsByCategory = async (req, res) => {
    try {
        const { restaurantId, categorie } = req.params;

        const restaurant = await Restaurant.findById(restaurantId);
        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant non trouvé' });
        }

        const products = await Product.find({ 
            restaurant: restaurantId, 
            categorie: categorie 
        });

        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};