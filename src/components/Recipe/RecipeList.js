import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { recipes } from '../../services/api';
import './Recipe.css';

const RecipeList = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [recipeList, setRecipeList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchRecipes = async (query = '') => {
        setLoading(true);
        try {
            const response = await recipes.getAll({ search: query });
            setRecipeList(response.data);
            setError('');
        } catch (err) {
            setError('Failed to fetch recipes');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRecipes();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchRecipes(searchQuery);
    };

    return (
        <div className="recipe-search-container">
         

            {error && <div className="error-message">{error}</div>}

            {loading ? (
                <div className="loading">Loading recipes...</div>
            ) : (
                <div className="recipes-grid">
                    {recipeList.map((recipe) => (
                        <div key={recipe._id} className="recipe-card">
                            <div className="recipe-details">
                                <h2>{recipe.title}</h2>
                                <div className="recipe-meta">
                                    <span>🕒 {recipe.cookingTime} mins</span>
                                    <span>📊 {recipe.difficulty}</span>
                                    <span>🍽️ {recipe.cuisine}</span>
                                </div>
                                <p className="recipe-description">{recipe.description}</p>
                                <Link to={`/recipes/${recipe._id}`} className="view-recipe-btn">
                                    View Recipe
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {!loading && recipeList.length === 0 && (
                <div className="no-recipes">
                    No recipes found. Try a different search or{' '}
                    <Link to="/recipes/share">share your own recipe</Link>!
                </div>
            )}
        </div>
    );
};

export default RecipeList;
