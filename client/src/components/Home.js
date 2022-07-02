import { useNavigate } from "react-router-dom";
import PostNav from "./PostNav";

export default function Home({ posts, postTotalPages, currentPage, setCurrentPage }) {
  const navigate = useNavigate();

  function postsRender() {
    return posts.map((post) => {
      const navigationHandler = () => {
        navigate("/posts/" + post.id);
      };
      return (
        <div key={post.id + "post"} onClick={() => navigationHandler()} className="postBox shortDesc">
          <h1>{post.title}</h1>
          <p>{post.body.slice(0, 120) + ". . ."}</p>
        </div>
      );
    });
  }
  if (posts === null) return <div>There is no Posts yet</div>;
  // if (!posts.length) return <div>No posts!</div>;
  return (
    <div className="dataContainer">
      <PostNav postTotalPages={postTotalPages} currentPage={currentPage} setCurrentPage={setCurrentPage}/>
      {postsRender()}
      <PostNav postTotalPages={postTotalPages} currentPage={currentPage} setCurrentPage={setCurrentPage}/>
    </div>
  );
}
