import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { recipes } from '../../services/api';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const [recipesList, setRecipesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoading(true);
        const response = await recipes.getAll();
        setRecipesList(response.data);
      } catch (err) {
        setError('Failed to fetch recipes');
        console.error('Error fetching recipes:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  const handleRecipeClick = (recipeId) => {
    navigate(`/recipe/${recipeId}`);
  };

  return (
    <div className="home">
      <div className="hero-section">
        <h1>Discover Amazing Recipes</h1>
      </div>

      <div className="recipes-section">
        <h2>Featured Recipes</h2>
        {loading ? (
          <div className="loading">Loading recipes...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : recipesList.length === 0 ? (
          <div className="no-recipes">No recipes found</div>
        ) : (
          <div className="recipes-grid">
            {recipesList.map(recipe => (
              <div 
                key={recipe._id} 
                className="recipe-card"
                onClick={() => handleRecipeClick(recipe._id)}
              >
                <img src={recipe.image} alt={recipe.title} />
                <div className="recipe-info">
                  <h3>{recipe.title}</h3>
                  <p>{recipe.description}</p>
                  <div className="recipe-meta">
                    <span>⏰ {recipe.cookingTime} mins</span>
                    <span>👥 {recipe.servings} servings</span>
                    <span>📝 {recipe.difficulty}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
