// import "./styles.css";
import { Fragment, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import server from "../utils/server";
import CommentBox from "./CommentBox";

export default function PostDetails({ posts, setPosts }) {
  const [editing, setEditing] = useState(false);
  const [post, setPost] = useState(null);
  const [body, setBody] = useState("");
  const [title, setTitle] = useState("");
  const navigate = useNavigate();
  let params = useParams();

  const fetchPost = async () => {
    const getOnePost = await server.get("/posts/" + params.postId);
    setPost(getOnePost.data);
    setBody(getOnePost.data.body);
    setTitle(getOnePost.data.title);
  };

  const updatePost = async () => {
    const updatePost = await server.put("/posts/" + post.id, {
      title: title,
      body: body,
    });
    return updatePost;
  };

  useEffect(() => {
    if (posts === null) {
    } else {
      const postFromProp = posts.find((post) => post.id == params.postId);
      if (postFromProp) {
        setPost(postFromProp);
        setTitle(postFromProp.title);
        setBody(postFromProp.body);
      } else {
        fetchPost();
      }
    }
  }, [posts]);

  const editHandle = () => {
    setEditing(true);
  };

  const handleSave = async () => {
    // 1 make an api call
    const res = await updatePost();
    console.log(res.status);
    if (res.status === 204) {
      setEditing(false);
    }
  };
  const handleDelete = async () => {
    const deletePost = await server.delete("/posts/" + params.postId);
    if (deletePost.status === 204) {
      setPosts(posts.filter(post => post.id != params.postId))
      navigate("/");
    }
  };
  const bodyRender = () => {
    if (editing) {
      return (
        <Fragment>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            type="text"
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
        </Fragment>
      );
    }
    return (
      <Fragment>
        <h1>{title}</h1>
        <p>{body}</p>
      </Fragment>
    );
  };

  const buttonsRender = () => {
    if (editing) {
      return (
        <Fragment>
          <button onClick={() => handleSave()}>Save</button>
          <button onClick={() => setEditing(false)}>Cancel</button>
          <button onClick={() => handleDelete()}>Delete</button>
        </Fragment>
      );
    }
    return <button onClick={() => editHandle()}>Edit</button>;
  };

  if (posts === null) return <div>Loading...</div>;
  // const thisPagePost =
  if (post === null || post === undefined)
    return <div>such post does not exist</div>;

  return (
    <div className="dataContainer inDetail">
      <div className="postBox">{bodyRender()}</div>
      {buttonsRender()}
      <CommentBox />
    </div>
  );
}
