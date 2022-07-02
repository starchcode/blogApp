import "./App.css";
import PageDetails from "./PageDetails";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { useState } from "react";

import Home from "./Home";
import Navbar from "./Navbar";

const apiPosts = {
  posts: [
    { id: 1, title: "title1", body: "body1" },
    { id: 2, title: "title2", body: "body2" },
  ],
  totalPages: 10
};

export default function App() {
  const [posts, setPosts] = useState(apiPosts.posts);
  const [postTotalPages, setPostTotalPages] = useState(0);
  const [currentPost, setCurrentPost] = useState({});
  const [comments, setComments] = useState({});
  const [commentsTotalPages, setCommentsTotalPages] = useState(0);
  
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home posts={posts} />} />
        <Route path="/posts/:postId" element={<PageDetails posts={posts} />} />
      </Routes>
    </BrowserRouter>
  );
}
