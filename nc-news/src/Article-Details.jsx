import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import "../CSS/Article-Details.css";

const ArticleDetails = () => {
  const [article, setArticle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  let { id } = useParams();

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/articles/${id}`
        );
        const data = await response.json();

        setArticle(data.article);
        setIsLoading(false);
      } catch (error) {
        console.error("Error:", error);
        setErrorMessage(error);
      }
    };

    fetchArticle();
  }, [id]);

//   useEffect(() => {
//     const fetchComments = async () => {
//       try {
//         const response = await fetch(
//           `${import.meta.env.VITE_API_URL}/api/articles/${id}/comments`
//         );
//         const data = await response.json();

//         setComments(data.comments);
//         setIsLoading(false);
//       } catch (error) {
//         console.error("Error:", error);
//         setErrorMessage(error);
//       }
//     };

//     fetchComments();
//   }, [id]);

  const handleCommentChange = (event) => {
    setNewComment(event.target.value);
  };

  const handleCommentSubmit = (event) => {
    event.preventDefault();
    // finish add comment function

    setNewComment("");
  };

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
    <div className="details-container">
      <div className="details-header">
        <h2 className="details-title">{article.title}</h2>
        <div className="details-info">
          <p className="details-author">Author: {article.author}</p>
          <p className="details-topic">Topic: {article.topic}</p>
          <p className="details-created-at">
            {" "}
            Posted: {new Date(article.created_at).toLocaleDateString("en-GB")}
          </p>
        </div>
        <img
          className="details-image"
          src={article.article_img_url}
          alt={article.title}
        />
        <p className="details-body">{article.body}</p>
      </div>
      <Link to="/">Go back to articles</Link>
    </div>
  );
};

export default ArticleDetails;
