const Groupe = require('../models/groupe.model');
const Table = require('../models/table.model');
const Restaurant = require('../models/restaurant.model');

// ==================== ADD GROUPE ====================
exports.addGroupe = async (req, res) => {
    try {
        const { restaurantId } = req.params;
        const { nomgroupe, description } = req.body;

        const restaurant = await Restaurant.findById(restaurantId);
        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant non trouvé' });
        }

        const groupe = new Groupe({
            nomgroupe,
            description,
            startNumber: null,
            endNumber: null,
            restaurant: restaurantId,
            tables: [],
            totalTablesofgroupe: 0,
            tablesOccupeesofgroupe: 0
        });

        await groupe.save();

        res.status(201).json({
            message: 'Groupe créée avec succès',
            groupe
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
// ==================== ADD TABLES TO GROUPE BY RANGE ====================
exports.addTablesToGroupeByRange = async (req, res) => {
    try {
        const { groupeId } = req.params;
        const { startNumber, endNumber } = req.body;

        const groupe = await Groupe.findById(groupeId);
        if (!groupe) {
            return res.status(404).json({ message: 'Groupe non trouvée' });
        }

        const tables = await Table.find({
            numero: { $gte: startNumber, $lte: endNumber }
        });

        if (tables.length === 0) {
            return res.status(404).json({ message: 'Aucune table trouvée dans cette plage' });
        }

        // ✅ التحقق من أن الطاولات ليست في مجموعة أخرى
        const tablesInOtherGroupe = tables.filter(t => t.groupe && t.groupe.toString() !== groupeId);
        
        if (tablesInOtherGroupe.length > 0) {
            return res.status(400).json({
                message: 'Ces tables appartiennent déjà à une autre groupe',
                tables: tablesInOtherGroupe.map(t => ({ numero: t.numero, groupeId: t.groupe }))
            });
        }

        const tableIds = tables.map(table => table._id);

        await Groupe.findByIdAndUpdate(groupeId, {
            $push: { tables: { $each: tableIds } },
            $set: { 
                totalTablesofgroupe: tables.length,
                startNumber: startNumber,
                endNumber: endNumber
            }
        });

        await Table.updateMany(
            { _id: { $in: tableIds } },
            { $set: { groupe: groupeId } }
        );

        res.status(200).json({
            message: `${tables.length} tables ajoutées à la groupe ${groupe.nomgroupe}`,
            tables: tables.map(t => ({ id: t._id, numero: t.numero }))
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
// ==================== GET ALL GROUPES BY RESTAURANT ====================
exports.getGroupesByRestaurant = async (req, res) => {
    try {
        const { restaurantId } = req.params;
        
        const groupes = await Groupe.find({ restaurant: restaurantId })
            .populate('tables')
            .populate('employe');

        res.status(200).json(groupes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ==================== GET GROUPE BY ID ====================
exports.getGroupeById = async (req, res) => {
    try {
        const { groupeId } = req.params;
        
        const groupe = await Groupe.findById(groupeId)
            .populate('tables')
            .populate('employe');

        if (!groupe) {
            return res.status(404).json({ message: 'Groupe non trouvée' });
        }

        res.status(200).json(groupe);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ==================== UPDATE GROUPE ====================
exports.updateGroupe = async (req, res) => {
    try {
        const { groupeId } = req.params;
        const { nomgroupe, description, employeId } = req.body;

        const groupe = await Groupe.findById(groupeId);
        if (!groupe) {
            return res.status(404).json({ message: 'Groupe non trouvée' });
        }

        if (nomgroupe) groupe.nomgroupe = nomgroupe;
        if (description) groupe.description = description;
        if (employeId) groupe.employe = employeId;

        await groupe.save();

        res.status(200).json({
            message: 'Groupe mise à jour avec succès',
            groupe
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ==================== DELETE GROUPE ====================
exports.deleteGroupe = async (req, res) => {
    try {
        const { groupeId } = req.params;

        const groupe = await Groupe.findById(groupeId);
        if (!groupe) {
            return res.status(404).json({ message: 'Groupe non trouvée' });
        }

        // إزالة référence المجموعة من الطاولات
        await Table.updateMany(
            { groupe: groupeId },
            { $unset: { groupe: "" } }
        );

        await Groupe.findByIdAndDelete(groupeId);

        res.status(200).json({
            message: 'Groupe supprimée avec succès'
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ==================== GET TABLES BY GROUPE ====================
exports.getTablesByGroupe = async (req, res) => {
    try {
        const { groupeId } = req.params;
        
        const groupe = await Groupe.findById(groupeId).populate('tables');
        if (!groupe) {
            return res.status(404).json({ message: 'Groupe non trouvée' });
        }

        res.status(200).json({
            groupe: {
                id: groupe._id,
                nom: groupe.nomgroupe
            },
            totalTables: groupe.totalTablesofgroupe,
            tables: groupe.tables
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ==================== GET STATS BY GROUPE ====================
exports.getGroupeStats = async (req, res) => {
    try {
        const { groupeId } = req.params;
        
        const groupe = await Groupe.findById(groupeId).populate('tables');
        if (!groupe) {
            return res.status(404).json({ message: 'Groupe non trouvée' });
        }

        const tablesOccupees = groupe.tables.filter(table => table.etat === 'occupée').length;

        res.status(200).json({
            groupeId: groupe._id,
            nomgroupe: groupe.nomgroupe,
            totalTables: groupe.totalTablesofgroupe,
            tablesOccupees: tablesOccupees,
            tablesLibres: groupe.totalTablesofgroupe - tablesOccupees
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
