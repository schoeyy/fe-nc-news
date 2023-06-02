import React, { useState, useEffect } from "react";
import "../CSS/Article-Comments.css";

const ArticleComments = ({ id, username }) => {
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [commentError, setCommentError] = useState("");
  const [newComment, setNewComment] = useState("");

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

  useEffect(() => {
    fetchComments();
  }, [id]);

  const handleAddComment = async (event) => {
    event.preventDefault();

    if (!newComment) {
      setCommentError("Comment field cannot be blank");
      setTimeout(() => {
        setCommentError("");
      }, 5000);
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/articles/${id}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            body: newComment,
            username: username.username.toLowerCase(),
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add comment");
      }

      const data = await response.json();

      fetchComments();
      setNewComment("");
    } catch (error) {
      console.error(error);
      setErrorMessage(error.message);
    }
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
    <div>
      <div className="add-comment">
        <textarea
          type="text"
          value={newComment}
          onChange={(event) => setNewComment(event.target.value)}
          placeholder="Write your comment here..."
          required
        />
        {commentError && <div className="update-message">{commentError}</div>}
        <button onClick={handleAddComment}>Submit Comment</button>
      </div>
      {comments.map((comment) => (
        <div key={comment.comment_id}>
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
