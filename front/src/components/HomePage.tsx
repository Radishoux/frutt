import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Article {
  id: number;
  title: string;
  description: string;
  price: number;
  image: string; // Base64 string for the image
}

const HomePage: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get<Article[]>('http://localhost:5000/api/articles');
        setArticles(response.data);
      } catch (error) {
        console.error('Error fetching articles:', error);
      }
    };

    fetchArticles();
  }, []);

  const handleCreateArticle = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/articles', {
        title: 'New Article',
        description: 'This is a new article',
        price: 9.99,
      });
      console.log('Article created:', response.data);
    } catch (error) {
      console.error('Error creating article:', error);
    }
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Welcome to the Candy Shop</h1>
        <button onClick={() => handleCreateArticle()} className="btn btn-primary">Create Article</button>
      </div>

      <div className="row">
        {articles.map((article) => (
          <div className="col-md-4 mb-4" key={article.id}>
            <div className="card h-100">
              {/* Use the Base64 string for the image source */}
              <img
                src={`data:image/jpeg;base64,${article.image}`}
                className="card-img-top"
                alt={article.title}
              />
              <div className="card-body">
                <h5 className="card-title">{article.title}</h5>
                <p className="card-text">{article.description}</p>
                <p className="card-text">{article.description}</p>
                <p className="card-text"><strong>€{Number(article.price).toFixed(2)}</strong></p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
