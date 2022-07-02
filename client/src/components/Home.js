import { useNavigate } from "react-router-dom";

export default function Home({ posts }) {
  const navigate = useNavigate();

  function postsRender() {
    return posts.map((post) => {
      const navigationHandler = () => {
        navigate("/posts/" + post.id);
      };
      return (
        <div onClick={() => navigationHandler()} className="postBox">
          <h1>{post.title}</h1>
          <p>{post.body}</p>
        </div>
      );
    });
  }

  return (
    <div className="dataContainer">{postsRender()}</div>
  )
}
