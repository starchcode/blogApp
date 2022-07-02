import "./App.css";
import PageDetails from "./PageDetails";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import server from "../utils/server";

import Home from "./Home";
import Navbar from "./Navbar";

const apiPosts = {
  posts: [
    { id: 1, title: "title1", body: "body1" },
    { id: 2, title: "title2", body: "body2" },
  ],
  totalPages: 10,
};

export default function App() {
  const [posts, setPosts] = useState([]);
  const [postTotalPages, setPostTotalPages] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const getPosts = await server.get("/posts");
      setPosts(getPosts.data.posts);
      setPostTotalPages(getPosts.data.totalPages);
      console.log('called for posts')
    }

    fetchData()
      .catch(console.error)

  }, []);


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
