import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { recipes } from '../../services/api';
import './Recipe.css';

const ShareRecipe = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        ingredients: [{ name: '', quantity: '' }],
        instructions: [''],
        cookingTime: '',
        difficulty: 'Medium',
        cuisine: '',
        image: '' // Optional now
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        // Clear error when user starts typing
        if (error) setError('');
    };

    const handleIngredientChange = (index, field, value) => {
        const newIngredients = [...formData.ingredients];
        newIngredients[index][field] = value;
        setFormData({ ...formData, ingredients: newIngredients });
        if (error) setError('');
    };

    const addIngredient = () => {
        setFormData({
            ...formData,
            ingredients: [...formData.ingredients, { name: '', quantity: '' }]
        });
    };

    const removeIngredient = (index) => {
        const newIngredients = formData.ingredients.filter((_, i) => i !== index);
        setFormData({ ...formData, ingredients: newIngredients });
    };

    const handleInstructionChange = (index, value) => {
        const newInstructions = [...formData.instructions];
        newInstructions[index] = value;
        setFormData({ ...formData, instructions: newInstructions });
        if (error) setError('');
    };

    const addInstruction = () => {
        setFormData({
            ...formData,
            instructions: [...formData.instructions, '']
        });
    };

    const removeInstruction = (index) => {
        const newInstructions = formData.instructions.filter((_, i) => i !== index);
        setFormData({ ...formData, instructions: newInstructions });
    };

    const validateForm = () => {
        if (!formData.title.trim()) return 'Recipe title is required';
        if (!formData.description.trim()) return 'Recipe description is required';
        if (!formData.cookingTime || formData.cookingTime <= 0) return 'Valid cooking time is required';
        if (!formData.cuisine.trim()) return 'Cuisine type is required';
        
        const emptyIngredient = formData.ingredients.find(ing => !ing.name.trim() || !ing.quantity.trim());
        if (emptyIngredient) return 'All ingredient fields must be filled';
        
        const emptyInstruction = formData.instructions.find(inst => !inst.trim());
        if (emptyInstruction) return 'All instruction steps must be filled';
        
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        setLoading(true);
        setError('');

        try {
            // Format ingredients array
            const formattedIngredients = formData.ingredients.map(ing => 
                `${ing.quantity} ${ing.name}`.trim()
            );

            // Convert cookingTime to number and format data
            const recipeData = {
                ...formData,
                ingredients: formattedIngredients,
                cookingTime: Number(formData.cookingTime),
                createdAt: new Date().toISOString()
            };
            
            const response = await recipes.create(recipeData);
            console.log('Recipe created:', response.data);
            
            // Show success message and redirect
            const successMessage = 'Recipe shared successfully!';
            navigate('/recipes', { 
                state: { 
                    message: successMessage,
                    recipe: response.data
                }
            });
        } catch (err) {
            console.error('Error creating recipe:', err);
            setError(err.response?.data?.error || 'Failed to share recipe. Please try again.');
            window.scrollTo(0, 0); // Scroll to top to show error
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="share-recipe-container">
            <h1>Share Your Recipe</h1>
            {error && <div className="error-message">{error}</div>}
            
            <form onSubmit={handleSubmit} className="recipe-form">
                <div className="form-group">
                    <label>Recipe Title</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        placeholder="Enter recipe title"
                    />
                </div>

                <div className="form-group">
                    <label>Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        placeholder="Describe your recipe"
                    />
                </div>

                <div className="form-group">
                    <label>Ingredients</label>
                    {formData.ingredients.map((ingredient, index) => (
                        <div key={index} className="ingredient-row">
                            <input
                                type="text"
                                value={ingredient.name}
                                onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
                                placeholder="Ingredient name"
                                required
                            />
                            <input
                                type="text"
                                value={ingredient.quantity}
                                onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)}
                                placeholder="Quantity"
                                required
                            />
                            {index > 0 && (
                                <button
                                    type="button"
                                    onClick={() => removeIngredient(index)}
                                    className="remove-btn"
                                >
                                    Remove
                                </button>
                            )}
                        </div>
                    ))}
                    <button type="button" onClick={addIngredient} className="add-btn">
                        Add Ingredient
                    </button>
                </div>

                <div className="form-group">
                    <label>Instructions</label>
                    {formData.instructions.map((instruction, index) => (
                        <div key={index} className="instruction-row">
                            <textarea
                                value={instruction}
                                onChange={(e) => handleInstructionChange(index, e.target.value)}
                                placeholder={`Step ${index + 1}`}
                                required
                            />
                            {index > 0 && (
                                <button
                                    type="button"
                                    onClick={() => removeInstruction(index)}
                                    className="remove-btn"
                                >
                                    Remove
                                </button>
                            )}
                        </div>
                    ))}
                    <button type="button" onClick={addInstruction} className="add-btn">
                        Add Step
                    </button>
                </div>

                <div className="form-group">
                    <label>Cooking Time (minutes)</label>
                    <input
                        type="number"
                        name="cookingTime"
                        value={formData.cookingTime}
                        onChange={handleChange}
                        required
                        min="1"
                    />
                </div>

                <div className="form-group">
                    <label>Difficulty</label>
                    <select name="difficulty" value={formData.difficulty} onChange={handleChange}>
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>Cuisine Type</label>
                    <input
                        type="text"
                        name="cuisine"
                        value={formData.cuisine}
                        onChange={handleChange}
                        required
                        placeholder="e.g., Italian, Indian, Chinese"
                    />
                </div>

                <button type="submit" className="submit-btn" disabled={loading}>
                    {loading ? 'Sharing...' : 'Share Recipe'}
                </button>
            </form>
        </div>
    );
};

export default ShareRecipe;
