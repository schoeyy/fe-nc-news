import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./Header";
import ArticleList from "./Article-Container";
import ArticleDetails from "./Article-Details";
import Login from "./Login";
import "../CSS/App.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  return (
    <Router>
      <Header />
      <Login
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
        username={username}
        setUsername={setUsername}
      />
      <Routes>
        <Route
          path="/articles/:id"
          element={<ArticleDetails username={username} />}
        />
        <Route path="/" element={<ArticleList />} />
      </Routes>
    </Router>
  );
}

export default App;
