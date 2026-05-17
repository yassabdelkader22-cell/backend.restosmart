const User = require('../models/user.model');
const Manager = require('../models/manager.model');
const Owner = require('../models/owner.model');
const Worker = require('../models/employe.model');  
const path = require('path');
const fs = require('fs');
const Restaurant = require('../models/restaurant.model'); // ✅ أضف هذا
const Category = require('../models/category.model'); // ✅ أضف هذا
const bcrypt = require('bcrypt');

// ==================== REGISTER ====================
module.exports.register = async (req, res) => {
    try {
        const { email, password, firstName, lastName, phone, role } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Cet email est déjà utilisé' });
        }

        const allowedRoles = ['WORKER', 'MANAGER', 'OWNER'];
        const finalRole = allowedRoles.includes(role) ? role : 'WORKER';

        const newUser = new User({
            email,
            password,
            firstName,
            lastName,
            phone,
            role: finalRole
        });

        await newUser.save();

        let profile = null;

        if (finalRole === 'MANAGER') {
            profile = new Manager({
                user: newUser._id,
                role: 'MANAGER'
            });
            await profile.save();
            
            // ✅ إنشاء مطعم تلقائياً للمدير
            const newRestaurant = new Restaurant({
                name: `Restaurant de ${firstName} ${lastName}`,
                phone: phone,
                email: email,
                manager: profile._id,
                owner: null
            });
            await newRestaurant.save();
            
            // ✅ إنشاء التصنيفات الأربعة تلقائياً للمطعم الجديد
            const categoriesData = [
                { name: 'Plats', categorie: 'plat', icon: '🍽️', restaurant: newRestaurant._id },
                { name: 'Boissons', categorie: 'boisson', icon: '🥤', restaurant: newRestaurant._id },
                { name: 'Chicha', categorie: 'chicha', icon: '💨', restaurant: newRestaurant._id },
                { name: 'Desserts', categorie: 'dessert', icon: '🍰', restaurant: newRestaurant._id }
            ];
            await Category.insertMany(categoriesData);
            
            // ربط المطعم بالمدير
            profile.restaurant = newRestaurant._id;
            await profile.save();
        }
        else if (finalRole === 'WORKER') {
            profile = new Worker({
                user: newUser._id,
                role: 'WORKER'
            });
            await profile.save();
        }
        else if (finalRole === 'OWNER') {
            profile = new Owner({
                user: newUser._id
            });
            await profile.save();
        }

        const userResponse = newUser.toObject();
        delete userResponse.password;

        res.status(201).json({
            message: 'Compte créé avec succès',
            user: userResponse,
            profile: profile ? profile._id : null,
            role: finalRole
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ==================== LOGIN ====================
module.exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'Email ou mot de passe incorrect' });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
        }

        const token = `fake-jwt-token-${user._id}-${Date.now()}`;

        const userResponse = user.toObject();
        delete userResponse.password;

        res.status(200).json({
            message: 'Connexion réussie',
            token,
            user: userResponse
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ==================== LOGOUT ====================
module.exports.logout = async (req, res) => {
    try {
        res.status(200).json({ message: 'Déconnexion réussie' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ==================== UPDATE PROFILE ====================
module.exports.updateProfile = async (req, res) => {
    try {
        const { userId } = req.params;
        const { firstName, lastName, phone, location, bio } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        if (firstName) user.firstName = firstName;
        if (lastName) user.lastName = lastName;
        if (phone) user.phone = phone;
        if (location) user.location = location;
        if (bio) user.bio = bio;

        await user.save();

        const userResponse = user.toObject();
        delete userResponse.password;

        res.status(200).json(userResponse);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ==================== RESET PASSWORD ====================
module.exports.resetPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'Email non trouvé' });
        }

        const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
        console.log(`🔐 Code de réinitialisation pour ${email}: ${resetCode}`);

        res.status(200).json({
            message: 'Code de réinitialisation envoyé par email',
            resetCode
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ==================== VERIFY RESET CODE ====================
module.exports.verifyResetCode = async (req, res) => {
    try {
        const { email, code, newPassword } = req.body;

        if (!code || code.length < 4) {
            return res.status(400).json({ message: 'Code invalide' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'Email non trouvé' });
        }

        user.password = newPassword;
        await user.save();

        res.status(200).json({ message: 'Mot de passe réinitialisé avec succès' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ==================== UPLOAD AVATAR ====================
module.exports.uploadAvatar = async (req, res) => {
    try {
        const { userId } = req.params;
        
        // استقبال الملف من req.files بدلاً من req.body
        if (!req.files || !req.files.avatar) {
            return res.status(400).json({ message: 'Aucune image envoyée' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        const avatarFile = req.files.avatar;
        
        // التحقق من نوع الملف
        if (!avatarFile.mimetype.startsWith('image/')) {
            return res.status(400).json({ message: 'Le fichier doit être une image' });
        }

        // إنشاء اسم فريد للملف
        const timestamp = Date.now();
        const random = Math.round(Math.random() * 1E9);
        const fileExtension = avatarFile.name.split('.').pop();
        const fileName = `avatar-${userId}-${timestamp}-${random}.${fileExtension}`;
        
        const uploadPath = `./uploads/${fileName}`;
        
        // نقل الملف إلى مجلد uploads
        avatarFile.mv(uploadPath, async (err) => {
            if (err) {
                return res.status(500).json({ message: 'Erreur lors de l\'upload' });
            }
            
            const avatarUrl = `http://localhost:5001/uploads/${fileName}`;
            user.avatar = avatarUrl;
            await user.save();
            
            res.status(200).json({ 
                message: 'Photo de profil mise à jour', 
                avatar: user.avatar 
            });
        });
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ==================== UPLOAD COVER IMAGE ====================
module.exports.uploadCoverImage = async (req, res) => {
    try {
        const { userId } = req.params;
        
        if (!req.files || !req.files.cover) {
            return res.status(400).json({ message: 'Aucune image envoyée' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        const coverFile = req.files.cover;
        
        if (!coverFile.mimetype.startsWith('image/')) {
            return res.status(400).json({ message: 'Le fichier doit être une image' });
        }

        const timestamp = Date.now();
        const random = Math.round(Math.random() * 1E9);
        const fileExtension = coverFile.name.split('.').pop();
        const fileName = `cover-${userId}-${timestamp}-${random}.${fileExtension}`;
        
        const uploadPath = `./uploads/${fileName}`;
        
        coverFile.mv(uploadPath, async (err) => {
            if (err) {
                return res.status(500).json({ message: 'Erreur lors de l\'upload' });
            }
            
            const coverUrl = `http://localhost:5001/uploads/${fileName}`;
            user.coverImage = coverUrl;
            await user.save();
            
            res.status(200).json({ 
                message: 'Image de couverture mise à jour', 
                coverImage: user.coverImage 
            });
        });
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ==================== UPDATE SOCIAL LINK ====================
module.exports.updateSocialLink = async (req, res) => {
    try {
        const { userId } = req.params;
        const { platform, url } = req.body;
        const SocialLink = require('../models/sociallink.model');

        let socialLink = await SocialLink.findOne({ user: userId, platform });
        if (socialLink) {
            socialLink.url = url;
            await socialLink.save();
        } else {
            socialLink = new SocialLink({ user: userId, platform, url });
            await socialLink.save();
        }

        res.status(200).json(socialLink);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ==================== SAVE SOCIAL LINKS ====================
module.exports.saveSocialLinks = async (req, res) => {
    try {
        const { userId } = req.params;
        const { facebook, instagram, twitter, linkedin, tiktok } = req.body;
        const SocialLink = require('../models/sociallink.model');
        const savedLinks = [];

        const platforms = { facebook, instagram, twitter, linkedin, tiktok };
        for (const [platform, url] of Object.entries(platforms)) {
            if (url) {
                let socialLink = await SocialLink.findOne({ user: userId, platform: platform.toUpperCase() });
                if (socialLink) {
                    socialLink.url = url;
                    await socialLink.save();
                } else {
                    socialLink = new SocialLink({ user: userId, platform: platform.toUpperCase(), url });
                    await socialLink.save();
                }
                savedLinks.push(socialLink);
            }
        }

        res.status(200).json(savedLinks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ==================== GET SOCIAL LINKS ====================
module.exports.getSocialLinks = async (req, res) => {
    try {
        const { userId } = req.params;
        const SocialLink = require('../models/sociallink.model');
        const socialLinks = await SocialLink.find({ user: userId });
        res.status(200).json(socialLinks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ==================== GET USER BY ID ====================
module.exports.getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });

        const userResponse = user.toObject();
        delete userResponse.password;

        res.status(200).json(userResponse);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ==================== GET PROFILE INFO ====================
module.exports.getProfileInfo = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });

        const userResponse = user.toObject();
        delete userResponse.password;

        res.status(200).json(userResponse);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ==================== GET ALL USERS ====================
module.exports.getAllUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const role = req.query.role;

        let query = {};
        if (role) query.role = role;

        const users = await User.find(query).skip(skip).limit(limit).sort({ createdAt: -1 });
        const total = await User.countDocuments(query);
        const totalPages = Math.ceil(total / limit);

        const usersResponse = users.map(user => {
            const u = user.toObject();
            delete u.password;
            return u;
        });

        res.status(200).json({
            total,
            totalPages,
            currentPage: page,
            limit,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1,
            users: usersResponse
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};