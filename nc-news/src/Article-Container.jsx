import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../CSS/Article-Container.css";

const ArticleList = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [articles, setArticles] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setIsLoading(true);
        const result = await fetch(
          `${import.meta.env.VITE_API_URL}/api/articles`
        );
        const data = await result.json();
        setArticles(data.articles);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching articles:", error);
        setErrorMessage(error);
      }
    };
    fetchArticles();
  }, []);

  if (isLoading) {
    return (
      <div className="loading-spinner-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }
  if (errorMessage) {
    return <div>Error: {errorMessage}</div>;
  }

  return (
    <>
      {articles.map((article) => (
        <div className="article" key={article.article_id}>
          <img
            className="article-image"
            src={article.article_img_url}
            alt={article.title}
          />
          <div className="article-text">
            <h2 className="article-title">{article.title}</h2>
            <p className="article-author">Author: {article.author}</p>
            <p className="article-topic">Topic: {article.topic}</p>
            <p className="article-create-date">
              Created at: {new Date(article.created_at).toLocaleDateString()}
            </p>
            <p className="article-comment-count">
              Comments: {article.comment_count}
            </p>
          </div>
        </div>
      ))}
    </>
  );
};

export default ArticleList;
