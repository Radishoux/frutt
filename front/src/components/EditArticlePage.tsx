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

const EditArticlePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [image, setImage] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await axios.get<Article>(`http://localhost:5000/api/article/${id}`);
        setArticle(response.data);
        setTitle(response.data.title);
        setDescription(response.data.description);
        setPrice(response.data.price.toString());
        setImage(response.data.image);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching article:', error);
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!image) {
      alert('Please upload an image');
      return;
    }

    try {
      await axios.put(`http://localhost:5000/api/articles/${id}`, {
        title,
        description,
        price: parseFloat(price),
        image,
      });

      alert('Article updated successfully!');
      navigate(`/article/${id}`);
    } catch (error) {
      console.error('Failed to update article:', error);
      alert('Failed to update article. Please try again.');
    }
  };

  if (loading) {
    return <div className="container mt-4">Loading...</div>;
  }

  if (!article) {
    return <div className="container mt-4">Article not found.</div>;
  }

  return (
    <div className="container mt-4">
      <button className="btn btn-secondary mb-4" onClick={() => navigate(`/article/${id}`)}>
        Back to Article
      </button>

      <h2>Edit Article</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">Title</label>
          <input
            type="text"
            className="form-control"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">Description</label>
          <textarea
            className="form-control"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="price" className="form-label">Price (EUR)</label>
          <input
            type="number"
            className="form-control"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          {image && (
            <img src={image} alt="Preview" className="img-fluid mt-3" style={{ maxWidth: '200px' }} />
          )}
        </div>
        <button type="submit" className="btn btn-primary">Update Article</button>
      </form>
    </div>
  );
};

export default EditArticlePage;
