import "./App.css";
import PageDetails from "./PageDetails";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import server from "../utils/server";

import Home from "./Home";
import Navbar from "./Navbar";
import NewPostPage from "./NewPostPage";

export default function App() {
  const [posts, setPosts] = useState(null);
  const [postTotalPages, setPostTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchPosts = async (pageNum) => {
    const getPosts = await server.get("/posts?page=" + pageNum);
    setPosts(getPosts.data.posts);
    setPostTotalPages(getPosts.data.totalPages);
  };

  useEffect(() => {
    fetchPosts(currentPage).catch((e) => {
      console.log(e);
    });
  }, [currentPage]);

  return (
    <BrowserRouter>
      <Navbar fetchPosts={fetchPosts} currentPage={currentPage}/>
      <Routes>
        <Route
          path="/"
          element={
            <Home
              posts={posts}
              postTotalPages={postTotalPages}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />
          }
        />
        <Route
          path="/posts/:postId"
          element={<PageDetails posts={posts} setPosts={setPosts} />}
        />
        <Route path="/newpostpage" element={<NewPostPage />} />
      </Routes>
    </BrowserRouter>
  );
}
