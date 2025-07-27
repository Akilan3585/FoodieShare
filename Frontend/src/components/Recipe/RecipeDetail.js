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
                console.log('Recipe data:', response.data);
                
                // Ensure ingredients are in the correct format
                const formattedRecipe = {
                    ...response.data,
                    ingredients: response.data.ingredients.map(ingredient => {
                        if (typeof ingredient === 'string') {
                            // If ingredient is a string, parse it into name and quantity
                            const [quantity, ...nameParts] = ingredient.split(' ');
                            return {
                                name: nameParts.join(' '),
                                quantity: quantity
                            };
                        }
                        return ingredient;
                    })
                };
                
                setRecipe(formattedRecipe);
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
                    {recipe.ingredients && recipe.ingredients.length > 0 ? (
                        recipe.ingredients.map((ingredient, index) => {
                            // Extract unit from name if it exists
                            let name = ingredient.name;
                            let unit = '';
                            const firstWord = name.split(' ')[0];
                            if (['ml', 'kg', 'g', 'tsp', 'tbsp'].includes(firstWord.toLowerCase())) {
                                unit = firstWord;
                                name = name.substring(unit.length).trim();
                            }
                            
                            return (
                                <li key={index}>
                                    <span className="ingredient-name">{name}</span>
                                    <span className="ingredient-quantity">
                                        {ingredient.quantity} {unit}
                                    </span>
                                </li>
                            );
                        })
                    ) : (
                        <li>No ingredients available</li>
                    )}
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
