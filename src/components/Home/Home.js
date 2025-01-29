import React, { useState } from 'react';
import './Home.css';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Sample data - replace with actual API calls
  const featuredRecipes = [
    {
      id: 1,
      title: 'Spicy Chicken Curry',
      image: 'https://via.placeholder.com/300',
      rating: 4.5,
      cookTime: '30 min',
      cuisine: 'Indian'
    },
    // Add more sample recipes
  ];

  return (
    <div className="home">
      <div className="hero-section">
        <h1>Discover & Share Amazing Recipes</h1>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search for recipes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="search-button">Search</button>
        </div>
      </div>

      <div className="categories-section">
        <h2>Popular Categories</h2>
        <div className="categories-grid">
          {['Indian', 'Italian', 'Chinese', 'Mexican', 'Thai', 'American'].map(category => (
            <div key={category} className="category-card">
              {category}
            </div>
          ))}
        </div>
      </div>

      <div className="featured-recipes">
        <h2>Featured Recipes</h2>
        <div className="recipes-grid">
          {featuredRecipes.map(recipe => (
            <div key={recipe.id} className="recipe-card">
              <img src={recipe.image} alt={recipe.title} />
              <div className="recipe-info">
                <h3>{recipe.title}</h3>
                <div className="recipe-meta">
                  <span>⭐ {recipe.rating}</span>
                  <span>⏰ {recipe.cookTime}</span>
                  <span>🍽️ {recipe.cuisine}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
