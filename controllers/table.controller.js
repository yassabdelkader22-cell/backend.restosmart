const Table = require('../models/table.model');
const Cart = require('../models/cart.model');
const Restaurant = require('../models/restaurant.model');
const Produit = require('../models/produit.model');
const { generateQRCode } = require('../utils/qrGenerator');  // ✅ الصحيح

// ==================== ADD TABLE ====================
exports.addTable = async (req, res) => {
    try {
        const { managerId, restaurantId } = req.params;
        const { numero, batchId } = req.body;

        const restaurant = await Restaurant.findById(restaurantId);
        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant non trouvé' });
        }

        const existingTable = await Table.findOne({ numero });
        if (existingTable) {
            return res.status(400).json({ message: 'Table numéro déjà existant' });
        }

        const qrUrl = `http://localhost:5001/api/menu/${restaurantId}/${numero}`;
        const qrResult = await generateQRCode({ url: qrUrl }, { format: 'png', size: 300 });
        const qrCodeBase64 = qrResult.data.toString('base64');

        const table = new Table({
            numero,
            qrCode: qrUrl,
            qrCodeImage: qrCodeBase64,
            batchId: batchId || `BATCH-${Date.now()}`,
            etat: 'libre',
            manager: managerId,
            employe: null,
            clientActuel: [],
            commandes: [],
            factures: []
        });

        await table.save();

        // ✅ ربط الطاولة بالمطعم
        await Restaurant.findByIdAndUpdate(
            restaurantId,
            { $push: { tables: table._id } }
        );

        const cart = new Cart({
            tableId: table._id,
            restaurantId,
            items: [],
            total: 0
        });
        await cart.save();

        res.status(201).json({
            message: 'Table ajoutée avec succès',
            table: {
                _id: table._id,
                numero: table.numero,
                qrCode: table.qrCode,
                qrCodeImage: `data:image/png;base64,${qrCodeBase64}`,
                etat: table.etat
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
// ==================== GET ALL TABLES ====================
exports.getAllTables = async (req, res) => {
    try {
        const tables = await Table.find().populate('groupe manager employe');
        res.status(200).json(tables);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ==================== GET TABLES BY RESTAURANT ====================
exports.getTablesByRestaurant = async (req, res) => {
    try {
        const { restaurantId } = req.params;
        // بما أن موديل Table ليس فيه restaurantId مباشر، نمرره عبر groupe
        const tables = await Table.find().populate({
            path: 'groupe',
            match: { restaurant: restaurantId }
        });
        const filteredTables = tables.filter(table => table.groupe !== null);
        res.status(200).json(filteredTables);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ==================== GET TABLE BY ID ====================
exports.getTableById = async (req, res) => {
    try {
        const { tableId } = req.params;
        const table = await Table.findById(tableId).populate('groupe manager employe commandes factures');
        if (!table) {
            return res.status(404).json({ message: 'Table non trouvée' });
        }
        res.status(200).json(table);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ==================== UPDATE TABLE STATUS ====================
exports.updateTableStatus = async (req, res) => {
    try {
        const { tableId } = req.params;
        const { etat } = req.body;

        const table = await Table.findById(tableId);
        if (!table) {
            return res.status(404).json({ message: 'Table non trouvée' });
        }

        table.etat = etat;
        if (etat === 'occupée') {
            table.lastOccupied = new Date();
        } else if (etat === 'libre') {
            table.lastFreed = new Date();
        }
        await table.save();

        res.status(200).json({
            message: 'Statut de la table mis à jour',
            table
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ==================== DELETE TABLE ====================
exports.deleteTable = async (req, res) => {
    try {
        const { tableId } = req.params;

        const table = await Table.findById(tableId);
        if (!table) {
            return res.status(404).json({ message: 'Table non trouvée' });
        }

        // ✅ إزالة الطاولة من المطعم
        await Restaurant.findByIdAndUpdate(
            table.restaurantId,
            { $pull: { tables: tableId } }
        );

        await Cart.findOneAndDelete({ tableId });
        await Table.findByIdAndDelete(tableId);

        res.status(200).json({
            message: 'Table supprimée avec succès'
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
// ==================== GET MENU BY TABLE (عند مسح QR Code) ====================
exports.getMenuByTable = async (req, res) => {
    try {
        const { restaurantId, tableNumero } = req.params;

        const restaurant = await Restaurant.findById(restaurantId);
        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant non trouvé' });
        }

        const table = await Table.findOne({ numero: tableNumero });
        if (!table) {
            return res.status(404).json({ message: 'Table non trouvée' });
        }

        const products = await Produit.find({ restaurant: restaurantId });

        const cart = await Cart.findOne({ tableId: table._id });

        res.status(200).json({
            restaurant: {
                id: restaurant._id,
                name: restaurant.name,
                logo: restaurant.logo
            },
            table: {
                id: table._id,
                numero: table.numero,
                etat: table.etat
            },
            products: products,
            cart: cart || { items: [], total: 0 }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ==================== ADD TO CART ====================
exports.addToCart = async (req, res) => {
    try {
        const { tableId } = req.params;
        const { productId, quantity } = req.body;

        let cart = await Cart.findOne({ tableId });
        if (!cart) {
            return res.status(404).json({ message: 'Panier non trouvé' });
        }

        const product = await Produit.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Produit non trouvé' });
        }

        const existingItem = cart.items.find(item => item.productId.toString() === productId);

        if (existingItem) {
            existingItem.quantity += quantity || 1;
        } else {
            cart.items.push({
                productId: product._id,
                name: product.name,
                quantity: quantity || 1,
                prix: product.prix
            });
        }

        cart.total = cart.items.reduce((sum, item) => sum + (item.prix * item.quantity), 0);
        await cart.save();

        res.status(200).json({
            message: 'Produit ajouté au panier',
            cart
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ==================== REMOVE FROM CART ====================
exports.removeFromCart = async (req, res) => {
    try {
        const { tableId, productId } = req.params;

        let cart = await Cart.findOne({ tableId });
        if (!cart) {
            return res.status(404).json({ message: 'Panier non trouvé' });
        }

        cart.items = cart.items.filter(item => item.productId.toString() !== productId);
        cart.total = cart.items.reduce((sum, item) => sum + (item.prix * item.quantity), 0);
        await cart.save();

        res.status(200).json({
            message: 'Produit retiré du panier',
            cart
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ==================== UPDATE CART QUANTITY ====================
exports.updateCartQuantity = async (req, res) => {
    try {
        const { tableId, productId } = req.params;
        const { quantity } = req.body;

        let cart = await Cart.findOne({ tableId });
        if (!cart) {
            return res.status(404).json({ message: 'Panier non trouvé' });
        }

        const item = cart.items.find(item => item.productId.toString() === productId);
        if (!item) {
            return res.status(404).json({ message: 'Produit non trouvé dans le panier' });
        }

        if (quantity <= 0) {
            cart.items = cart.items.filter(item => item.productId.toString() !== productId);
        } else {
            item.quantity = quantity;
        }

        cart.total = cart.items.reduce((sum, item) => sum + (item.prix * item.quantity), 0);
        await cart.save();

        res.status(200).json({
            message: 'Quantité mise à jour',
            cart
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ==================== GET CART BY TABLE ====================
exports.getCartByTable = async (req, res) => {
    try {
        const { tableId } = req.params;
        
        const cart = await Cart.findOne({ tableId });
        if (!cart) {
            return res.status(404).json({ message: 'Panier non trouvé' });
        }

        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ==================== CLEAR CART ====================
exports.clearCart = async (req, res) => {
    try {
        const { tableId } = req.params;

        let cart = await Cart.findOne({ tableId });
        if (!cart) {
            return res.status(404).json({ message: 'Panier non trouvé' });
        }

        cart.items = [];
        cart.total = 0;
        await cart.save();

        res.status(200).json({
            message: 'Panier vidé avec succès',
            cart
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
// ==================== GET QR CODE IMAGE ====================
exports.getQRCodeImage = async (req, res) => {
    try {
        const { tableId } = req.params;
        const table = await Table.findById(tableId);
        if (!table) {
            return res.status(404).json({ message: 'Table non trouvée' });
        }
        
        // إزالة "data:image/png;base64," من البداية
        const base64Data = table.qrCodeImage.replace(/^data:image\/png;base64,/, '');
        const imageBuffer = Buffer.from(base64Data, 'base64');
        
        res.set('Content-Type', 'image/png');
        res.send(imageBuffer);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
// ==================== ADD MULTIPLE TABLES ====================
exports.addMultipleTables = async (req, res) => {
    try {
        const { managerId, restaurantId } = req.params;
        const { tables } = req.body;

        const restaurant = await Restaurant.findById(restaurantId);
        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant non trouvé' });
        }

        const createdTables = [];
        
        for (const tableData of tables) {
            const { numero, batchId } = tableData;

            const existingTable = await Table.findOne({ numero });
            if (existingTable) continue;

            const qrUrl = `http://localhost:5001/api/menu/${restaurantId}/${numero}`;
            const qrResult = await generateQRCode({ url: qrUrl }, { format: 'png', size: 300 });
            const qrCodeBase64 = qrResult.data.toString('base64');

            const table = new Table({
                numero,
                qrCode: qrUrl,
                qrCodeImage: qrCodeBase64,
                batchId: batchId || `BATCH-${Date.now()}`,
                etat: 'libre',
                manager: managerId,
                employe: null,
                clientActuel: [],
                commandes: [],
                factures: []
            });

            await table.save();

            // ✅ ربط الطاولة بالمطعم
            await Restaurant.findByIdAndUpdate(
                restaurantId,
                { $push: { tables: table._id } }
            );

            const cart = new Cart({
                tableId: table._id,
                restaurantId,
                items: [],
                total: 0
            });
            await cart.save();

            createdTables.push({
                id: table._id,
                numero: table.numero,
                qrCode: table.qrCode,
                qrCodeImage: `data:image/png;base64,${qrCodeBase64}`
            });
        }

        res.status(201).json({
            message: `${createdTables.length} tables ajoutées avec succès`,
            tables: createdTables
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
// ==================== DELETE MULTIPLE TABLES ====================
exports.deleteMultipleTables = async (req, res) => {
    try {
        const { restaurantId } = req.params;
        const { tableIds } = req.body;

        if (!tableIds || tableIds.length === 0) {
            return res.status(400).json({ message: 'Aucun ID de table fourni' });
        }

        let deletedCount = 0;
        
        for (const tableId of tableIds) {
            const table = await Table.findById(tableId);
            if (table) {
                await Restaurant.findByIdAndUpdate(
                    restaurantId,
                    { $pull: { tables: tableId } }
                );
                await Cart.findOneAndDelete({ tableId });
                await Table.findByIdAndDelete(tableId);
                deletedCount++;
            }
        }

        res.status(200).json({
            message: `${deletedCount} tables supprimées avec succès`
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ==================== GET QR CODE BY TABLE NUMBER ====================
exports.getQRCodeByTableNumber = async (req, res) => {
    try {
        const { restaurantId, tableNumero } = req.params;
        
        const restaurant = await Restaurant.findById(restaurantId).populate('tables');
        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant non trouvé' });
        }
        
        const table = restaurant.tables.find(t => t.numero === parseInt(tableNumero));
        
        if (!table) {
            return res.status(404).json({ message: 'Table non trouvée' });
        }
        
        const base64Data = table.qrCodeImage.replace(/^data:image\/png;base64,/, '');
        const imageBuffer = Buffer.from(base64Data, 'base64');
        
        res.set('Content-Type', 'image/png');
        res.send(imageBuffer);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};