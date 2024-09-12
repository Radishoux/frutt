import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

interface Article {
  id: number;
  title: string;
  description: string;
  price: number;
  image: string;
  tags: string[];
}

const ArticlePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await axios.get<Article>(`http://localhost:5000/api/article/${id}`);
        setArticle(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching article:', error);
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  if (loading) {
    return <div className="container mt-4">Loading...</div>;
  }

  if (!article) {
    return <div className="container mt-4">Article not found.</div>;
  }

  return (
    <div className="container mt-4">
      {/* Back to Homepage Button */}
      <button className="btn btn-secondary mb-4" onClick={() => navigate('/')}>
        Back to Homepage
      </button>
      <br />
      <button className="btn btn-primary mb-4" onClick={() => navigate(`/edit/${id}`)}>
        Edit article
      </button>

      <div className="row">
        {/* Left Column: Image */}
        <div className="col-md-6">
          <img
            src={article.image}
            alt={article.title}
            className="img-fluid"
          />
        </div>

        {/* Right Column: Title, Price, Add to Cart, Description */}
        <div className="col-md-6">
          <h2>{article.title}</h2>
          <p className="h4 text-danger">€{Number(article.price).toFixed(2)}</p> {/* Display price in a prominent style */}
          <button className="btn btn-success mb-3">Add to Cart</button>
          <div>
            <h4>Description</h4>
            <p>{article.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticlePage;
