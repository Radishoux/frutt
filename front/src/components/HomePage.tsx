import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

interface Article {
  id: number;
  title: string;
  description: string;
  price: number;
  image: string; // Base64 string for the image
  tags: string[];
}

const HomePage: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortOption, setSortOption] = useState<string>('');

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get<Article[]>('http://localhost:5000/api/articles');
        console.log(response.data);
        setArticles(response.data);
        setFilteredArticles(response.data);
      } catch (error) {
        console.error('Error fetching articles:', error);
      }
    };

    fetchArticles();
  }, []);


  useEffect(() => {
    const filtered = articles.filter((article) =>
      article.title.toLowerCase().startsWith(searchTerm.toLowerCase())
    );
    setFilteredArticles(filtered);
  }, [searchTerm, articles]);


  useEffect(() => {
    const sortedArticles = [...filteredArticles];

    switch (sortOption) {
      case 'title-asc':
        sortedArticles.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'title-desc':
        sortedArticles.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case 'price-asc':
        sortedArticles.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        sortedArticles.sort((a, b) => b.price - a.price);
        break;
      default:
        break;
    }

    setFilteredArticles(sortedArticles);
  }, [sortOption]);

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Welcome to the Candy Shop</h1>
        <Link to="/create-article" className="btn btn-primary">
          Create Article
        </Link>
      </div>

      {/* Search and Sort Controls */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        {/* Search Bar */}
        <input
          type="text"
          className="form-control me-2"
          placeholder="Search articles by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* Sort Dropdown */}
        <select
          className="form-select"
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
        >
          <option value="">Sort By</option>
          <option value="title-asc">Title (A-Z)</option>
          <option value="title-desc">Title (Z-A)</option>
          <option value="price-asc">Price (Lowest to Highest)</option>
          <option value="price-desc">Price (Highest to Lowest)</option>
        </select>
      </div>

      {/* Articles Display */}
      <div className="row">
        {filteredArticles.map((article) => (
          <div className="col-md-4 mb-4" key={article.id}>
            <div className="card h-100">
              <Link to={`/article/${article.id}`}>
                <img
                  src={article.image}
                  className="card-img-top"
                  alt={article.title}
                />
              </Link>
              <div className="card-body">
                <h5 className="card-title">{article.title}</h5>
                <p className="card-text">{article.description}</p>
                <p className="card-text">
                  <strong>€{Number(article.price).toFixed(2)}</strong>
                </p>
                <button className="btn btn-warning mt-2">Add to Cart</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
