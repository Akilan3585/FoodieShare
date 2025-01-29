const express = require('express');
const router = express.Router();
const Recipe = require('../models/Recipe');
const auth = require('../middleware/auth');

// Get all recipes with optional search
router.get('/', async (req, res) => {
    try {
        let query = {};
        
        // Handle search
        if (req.query.search) {
            query = { $text: { $search: req.query.search } };
        }

        // Handle filters
        if (req.query.difficulty) {
            query.difficulty = req.query.difficulty;
        }
        if (req.query.cuisine) {
            query.cuisine = req.query.cuisine;
        }

        const recipes = await Recipe.find(query)
            .populate('author', 'username profilePicture')
            .sort({ createdAt: -1 });
            
        res.json(recipes);
    } catch (error) {
        console.error('Error fetching recipes:', error);
        res.status(500).json({ 
            error: 'Failed to fetch recipes. Please try again.' 
        });
    }
});

// Get single recipe
router.get('/:id', async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id)
            .populate('author', 'username profilePicture')
            .populate('comments.user', 'username profilePicture');
        
        if (!recipe) {
            return res.status(404).json({ error: 'Recipe not found' });
        }
        
        res.json(recipe);
    } catch (error) {
        console.error('Error fetching recipe:', error);
        res.status(500).json({ 
            error: 'Failed to fetch recipe. Please try again.' 
        });
    }
});

// Create recipe
router.post('/', auth, async (req, res) => {
    try {
        // Validate required fields
        const requiredFields = ['title', 'description', 'ingredients', 'instructions', 
                              'cookingTime', 'servings', 'difficulty', 'cuisine'];
        
        const missingFields = requiredFields.filter(field => !req.body[field]);
        if (missingFields.length > 0) {
            return res.status(400).json({ 
                error: `Missing required fields: ${missingFields.join(', ')}` 
            });
        }

        // Create new recipe
        const recipe = new Recipe({
            ...req.body,
            author: req.user.userId
        });
        
        // Save to database
        await recipe.save();
        
        // Populate author details
        await recipe.populate('author', 'username profilePicture');
        
        console.log('Recipe created successfully:', recipe._id);
        res.status(201).json(recipe);
    } catch (error) {
        console.error('Error creating recipe:', error);
        
        // Handle validation errors
        if (error.name === 'ValidationError') {
            const validationErrors = Object.values(error.errors)
                .map(err => err.message)
                .join(', ');
            
            return res.status(400).json({ 
                error: `Validation failed: ${validationErrors}` 
            });
        }
        
        res.status(500).json({ 
            error: 'Failed to create recipe. Please try again.' 
        });
    }
});

// Update recipe
router.patch('/:id', auth, async (req, res) => {
    try {
        const recipe = await Recipe.findOne({
            _id: req.params.id,
            author: req.user.userId
        });

        if (!recipe) {
            return res.status(404).json({ 
                error: 'Recipe not found or you do not have permission to edit it' 
            });
        }

        // Update allowed fields
        const allowedUpdates = [
            'title', 'description', 'ingredients', 'instructions',
            'cookingTime', 'servings', 'difficulty', 'cuisine', 'image'
        ];
        
        Object.keys(req.body).forEach(update => {
            if (allowedUpdates.includes(update)) {
                recipe[update] = req.body[update];
            }
        });

        await recipe.save();
        await recipe.populate('author', 'username profilePicture');
        
        console.log('Recipe updated successfully:', recipe._id);
        res.json(recipe);
    } catch (error) {
        console.error('Error updating recipe:', error);
        
        if (error.name === 'ValidationError') {
            const validationErrors = Object.values(error.errors)
                .map(err => err.message)
                .join(', ');
            
            return res.status(400).json({ 
                error: `Validation failed: ${validationErrors}` 
            });
        }
        
        res.status(500).json({ 
            error: 'Failed to update recipe. Please try again.' 
        });
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
            return res.status(404).json({ 
                error: 'Recipe not found or you do not have permission to delete it' 
            });
        }

        console.log('Recipe deleted successfully:', req.params.id);
        res.json({ message: 'Recipe deleted successfully' });
    } catch (error) {
        console.error('Error deleting recipe:', error);
        res.status(500).json({ 
            error: 'Failed to delete recipe. Please try again.' 
        });
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
        console.error('Error liking recipe:', error);
        res.status(500).json({ 
            error: 'Failed to like recipe. Please try again.' 
        });
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
        console.error('Error commenting on recipe:', error);
        res.status(500).json({ 
            error: 'Failed to comment on recipe. Please try again.' 
        });
    }
});

module.exports = router;
