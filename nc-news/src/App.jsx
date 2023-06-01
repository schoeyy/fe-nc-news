import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./Header";
import ArticleList from "./Article-Container";
import ArticleDetails from "./Article-Details";
import "../CSS/App.css";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/articles/:id" element={<ArticleDetails />} />
        <Route path="/" element={<ArticleList />} />
      </Routes>
    </Router>
  );
}

export default App;
