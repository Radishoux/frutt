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
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [showTagDrawer, setShowTagDrawer] = useState<boolean>(false);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get<Article[]>('http://localhost:5000/api/articles');
        setArticles(response.data);
        setFilteredArticles(response.data);


        const tags = Array.from(new Set(response.data.flatMap((article) => article.tags)));
        setAvailableTags(tags);
      } catch (error) {
        console.error('Error fetching articles:', error);
      }
    };

    fetchArticles();
  }, []);


  useEffect(() => {
    let filtered = articles.filter((article) =>
      article.title.toLowerCase().startsWith(searchTerm.toLowerCase())
    );


    if (selectedTags.size > 0) {
      filtered = filtered.filter((article) =>
        article.tags.some((tag) => selectedTags.has(tag))
      );
    }

    setFilteredArticles(filtered);
    setSortOption('');
  }, [searchTerm, selectedTags, articles]);


  useEffect(() => {
    // eslint-disable-next-line prefer-const
    let sortedArticles = [...filteredArticles];

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


  const handleTagSelection = (tag: string) => {
    const newSelectedTags = new Set(selectedTags);
    if (selectedTags.has(tag)) {
      newSelectedTags.delete(tag);
    } else {
      newSelectedTags.add(tag);
    }
    setSelectedTags(newSelectedTags);
  };

  const toggleTagDrawer = () => {
    setShowTagDrawer(!showTagDrawer);
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Welcome to the Candy Shop</h1>
        <Link to="/create-article" className="btn btn-primary">
          Create Article
        </Link>
      </div>

      {/* Search, Sort, and Tag Filters Controls */}
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
          className="form-select me-2"
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
        >
          <option value="">Sort By</option>
          <option value="title-asc">Title (A-Z)</option>
          <option value="title-desc">Title (Z-A)</option>
          <option value="price-asc">Price (Lowest to Highest)</option>
          <option value="price-desc">Price (Highest to Lowest)</option>
        </select>

        {/* Filter by Tags Button */}
        <button
          className="btn btn-outline-primary"
          type="button"
          onClick={toggleTagDrawer}
        >
          Filter by Tags
        </button>
      </div>

      {/* Selected Tags Display */}
      {selectedTags.size > 0 && (
        <div className="mb-4">
          <h5>Selected Tags:</h5>
          {[...selectedTags].map((tag) => (
            <span key={tag} className="badge bg-primary me-2">
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Tag Drawer */}
      <div
        className={`offcanvas offcanvas-end ${showTagDrawer ? 'show' : ''}`}
        tabIndex={-1}
        id="tagDrawer"
        style={{ visibility: showTagDrawer ? 'visible' : 'hidden' }}
        aria-labelledby="tagDrawerLabel"
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="tagDrawerLabel">
            Filter by Tags
          </h5>
          <button
            type="button"
            className="btn-close text-reset"
            aria-label="Close"
            onClick={toggleTagDrawer}
          ></button>
        </div>
        <div className="offcanvas-body">
          {availableTags.map((tag) => (
            <div key={tag} className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                value={tag}
                id={`tag-${tag}`}
                checked={selectedTags.has(tag)}
                onChange={() => handleTagSelection(tag)}
              />
              <label className="form-check-label" htmlFor={`tag-${tag}`}>
                {tag}
              </label>
            </div>
          ))}
        </div>
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
