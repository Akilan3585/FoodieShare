import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { recipes } from '../../services/api';
import './Recipe.css';

const RecipeDetail = () => {
    const { id } = useParams();
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                const response = await recipes.getById(id);
                setRecipe(response.data);
                setError('');
            } catch (err) {
                setError('Failed to fetch recipe details');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchRecipe();
    }, [id]);

    if (loading) return <div className="loading">Loading recipe...</div>;
    if (error) return <div className="error-message">{error}</div>;
    if (!recipe) return <div className="not-found">Recipe not found</div>;

    return (
        <div className="recipe-detail-container">
            <h1>{recipe.title}</h1>
            
            <div className="recipe-meta-info">
                <span>🕒 Cooking Time: {recipe.cookingTime} minutes</span>
                <span>📊 Difficulty: {recipe.difficulty}</span>
                <span>🍽️ Cuisine: {recipe.cuisine}</span>
            </div>

            <div className="recipe-section">
                <h2>Description</h2>
                <p>{recipe.description}</p>
            </div>

            <div className="recipe-section">
                <h2>Ingredients</h2>
                <ul className="ingredients-list">
                    {recipe.ingredients.map((ingredient, index) => (
                        <li key={index}>
                            <span className="ingredient-name">{ingredient.name}</span>
                            <span className="ingredient-quantity">{ingredient.quantity}</span>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="recipe-section">
                <h2>Instructions</h2>
                <ol className="instructions-list">
                    {recipe.instructions.map((instruction, index) => (
                        <li key={index}>{instruction}</li>
                    ))}
                </ol>
            </div>

            <div className="recipe-footer">
                <p>Shared by: {recipe.author?.name || 'Anonymous'}</p>
                <p>Last updated: {new Date(recipe.updatedAt).toLocaleDateString()}</p>
            </div>
        </div>
    );
};

export default RecipeDetail;
