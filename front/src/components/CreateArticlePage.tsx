import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateArticlePage: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [imageWarning, setImageWarning] = useState<string>('');
  const navigate = useNavigate();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 50 * 1024) {
        setImageWarning('Image size must not exceed 50KB');
        setImage(null);
      } else {
        setImageWarning('');
        const reader = new FileReader();
        reader.onloadend = () => {
          setImage(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const isFormValid = (): boolean => {
    return (
      title.trim() !== '' &&
      description.trim() !== '' &&
      price !== '' &&
      parseFloat(price) >= 0.01 &&
      image !== null
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!image) {
      alert('Please upload an image');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/articles', {
        title,
        description,
        price,
        image,
      });
      navigate('/');
    } catch (error) {
      console.error('Error creating article:', error);
    }
  };

  return (
    <div>
      <button className="btn btn-secondary mb-3" onClick={() => navigate('/')}>
        Return to Homepage
      </button>
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
          <label htmlFor="image" className="form-label">Upload Image</label>
          <input
            type="file"
            className="form-control"
            id="image"
            accept="image/*"
            onChange={handleImageChange}
            required
          />
          {imageWarning && <div className="text-danger">{imageWarning}</div>}
        </div>
        <button type="submit" className="btn btn-primary" disabled={!isFormValid()}>Create Article</button>
      </form>
    </div>
  );
};

export default CreateArticlePage;