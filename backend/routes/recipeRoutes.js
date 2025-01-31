const express = require('express');
const router = express.Router();
const Recipe = require('../models/Recipe');
const auth = require('../middleware/auth');

// Get all recipes
router.get('/', async (req, res) => {
    try {
        const recipes = await Recipe.find()
            .populate('author', 'username profilePicture')
            .sort({ createdAt: -1 });
        res.json(recipes);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});



// Create recipe
router.post('/', auth, async (req, res) => {
    try {
        const recipe = new Recipe({
            ...req.body,
            author: req.user.userId
        });
        
        await recipe.save();
        await recipe.populate('author', 'username profilePicture');
        
        res.status(201).json(recipe);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Update recipe
router.patch('/:id', auth, async (req, res) => {
    try {
        const recipe = await Recipe.findOne({ _id: req.params.id, author: req.user.userId });
        
        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found or unauthorized' });
        }

        Object.assign(recipe, req.body);
        await recipe.save();
        await recipe.populate('author', 'username profilePicture');
        
        res.json(recipe);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete recipe
router.delete('/:id', auth, async (req, res) => {
    try {
        const recipe = await Recipe.findOneAndDelete({ 
            _id: req.params.id, 
            author: req.user.userId 
        });
        
        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found or unauthorized' });
        }
        
        res.json({ message: 'Recipe deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Toggle like
router.post('/:id/like', auth, async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        
        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }

        const likeIndex = recipe.likes.indexOf(req.user.userId);
        
        if (likeIndex === -1) {
            recipe.likes.push(req.user.userId);
        } else {
            recipe.likes.splice(likeIndex, 1);
        }
        
        await recipe.save();
        res.json(recipe);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Add comment
router.post('/:id/comments', auth, async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        
        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }

        recipe.comments.push({
            user: req.user.userId,
            text: req.body.text
        });
        
        await recipe.save();
        await recipe.populate('comments.user', 'username profilePicture');
        
        res.json(recipe);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
