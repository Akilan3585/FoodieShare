const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Recipe title is required'],
        trim: true,
        minlength: [3, 'Title must be at least 3 characters long']
    },
    description: {
        type: String,
        required: [true, 'Recipe description is required'],
        trim: true,
        minlength: [10, 'Description must be at least 10 characters long']
    },
    ingredients: [{
        type: String,
        required: [true, 'At least one ingredient is required']
    }],
    instructions: [{
        type: String,
        required: [true, 'At least one instruction step is required']
    }],
    image: {
        type: String,
        default: '' // Optional, will add image upload later
    },
    cookingTime: {
        type: Number,
        required: [true, 'Cooking time is required'],
        min: [1, 'Cooking time must be at least 1 minute']
    },
    servings: {
        type: Number,
        required: [true, 'Number of servings is required'],
        min: [1, 'Servings must be at least 1']
    },
    difficulty: {
        type: String,
        enum: {
            values: ['Easy', 'Medium', 'Hard'],
            message: '{VALUE} is not a valid difficulty level'
        },
        required: [true, 'Difficulty level is required']
    },
    cuisine: {
        type: String,
        required: [true, 'Cuisine type is required'],
        trim: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    comments: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        text: {
            type: String,
            required: true,
            trim: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }]
}, {
    timestamps: true // Automatically add createdAt and updatedAt fields
});

// Add text index for search functionality
recipeSchema.index({ 
    title: 'text', 
    description: 'text',
    cuisine: 'text'
});

const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe;
