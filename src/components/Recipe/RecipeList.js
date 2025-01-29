import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { recipes } from '../../services/api';
import './Recipe.css';

const RecipeList = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [recipeList, setRecipeList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [sortBy, setSortBy] = useState('newest');

    const fetchRecipes = async (query = '') => {
        setLoading(true);
        try {
            const response = await recipes.getAll({ search: query });
            let sortedRecipes = [...response.data];
            
            // Sort recipes based on selected criteria
            if (sortBy === 'newest') {
                sortedRecipes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            } else if (sortBy === 'oldest') {
                sortedRecipes.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            }
            
            setRecipeList(sortedRecipes);
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
    }, [sortBy]); // Refetch when sort criteria changes

    const handleSearch = (e) => {
        e.preventDefault();
        fetchRecipes(searchQuery);
    };

    const handleSortChange = (e) => {
        setSortBy(e.target.value);
    };

    return (
        <div className="recipe-list-container">
            <div className="recipe-controls">
                <form onSubmit={handleSearch} className="search-bar">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search for recipes..."
                    />
                    <button type="submit">Search</button>
                </form>

                <div className="sort-control">
                    <select value={sortBy} onChange={handleSortChange}>
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                    </select>
                </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            {loading ? (
                <div className="loading">Loading recipes...</div>
            ) : recipeList.length === 0 ? (
                <div className="no-recipes">
                    <p>No recipes found.</p>
                    <Link to="/recipes/share" className="add-recipe-link">
                        Share your first recipe!
                    </Link>
                </div>
            ) : (
                <div className="recipe-grid">
                    {recipeList.map(recipe => (
                        <div key={recipe._id} className="recipe-card">
                            <Link to={`/recipes/${recipe._id}`}>
                                {recipe.image ? (
                                    <img src={recipe.image} alt={recipe.title} />
                                ) : (
                                    <div className="recipe-placeholder">
                                        <span>No Image</span>
                                    </div>
                                )}
                                <div className="recipe-info">
                                    <h3>{recipe.title}</h3>
                                    <p className="recipe-description">{recipe.description}</p>
                                    <div className="recipe-meta">
                                        <span>{recipe.cookingTime} mins</span>
                                        <span>{recipe.difficulty}</span>
                                        <span>{recipe.cuisine}</span>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default RecipeList;
