import React, { useState, useEffect } from "react";
import "../CSS/Article-Comments.css";

const ArticleComments = ({ id }) => {
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchComments = async () => {
      setIsLoading(true);

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/articles/${id}/comments`
        );

        if (!response.ok) {
          throw new Error("Error while fetching comments");
        }

        const data = await response.json();

        setComments(data.comments);
        setIsLoading(false);
      } catch (error) {
        console.error("Error:", error);
        setErrorMessage(error.message);
        setIsLoading(false);
      }
    };

    fetchComments();
  }, [id]);

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
    <div>
      {comments.map((comment) => (
        <div key={comment.id}>
          <div className="article-comment">
            <p>{comment.body}</p>
            <div className="article-comment-info">
              <p>Author: {comment.author}</p>
              <p>
                Posted:{" "}
                {new Date(comment.created_at).toLocaleDateString("en-GB")}
              </p>
              <p>Upvotes: {comment.votes}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ArticleComments;
