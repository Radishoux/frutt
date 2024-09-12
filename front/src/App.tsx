import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import CreateArticlePage from './components/CreateArticlePage';
import ArticlePage from './components/ArticlePage';
import EditArticlePage from './components/EditArticlePage';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create-article" element={<CreateArticlePage />} />
        <Route path="/article/:id" element={<ArticlePage />} />
        <Route path="/edit/:id" element={<EditArticlePage />} />
      </Routes>
    </Router>
  );
};

export default App;
