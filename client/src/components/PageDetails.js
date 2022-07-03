// import "./styles.css";
import { Fragment, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import server from "../utils/server";
import CommentBox from "./CommentBox";

export default function PostDetails({ posts }) {
  const [editing, setEditing] = useState(false);
  const [body, setBody] = useState("");
  const [post, setPost] = useState(null);

  let params = useParams();

  const fetchPost = async () => {
    const getOnePost = await server.get("/posts/" + params.postId);
    setPost(getOnePost.data);
  };

  useEffect(() => {
    if (posts === null) {
    } else {
      const postFromProp = posts.find((post) => post.id == params.postId);
      if (postFromProp) {
        setPost(postFromProp);
      } else {
        fetchPost();
      }
    }
  }, [posts]);

  const editHandle = () => {
    setEditing(true);
    // setBody(body || thisPagePost.body);
  };

  const handleSave = () => {
    // 1 make an api call
    // 2 recieve response
    // 3A if successful nothing to be done
    //    setEditing to true
    setEditing(false);

    // 3A if unsuccessful setBody do not setEditing to False
    // show error message
    // setBody(body)
  };

  const bodyRender = (bodyContent) => {
    if (editing) {
      return (
        <textarea
          type="text"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
      );
    }
    return <p>{bodyContent}</p>;
  };

  const buttonsRender = () => {
    if (editing) {
      return (
        <Fragment>
          <button onClick={() => handleSave()}>Save</button>
          <button>Cancel</button>
        </Fragment>
      );
    }
    return <button onClick={() => editHandle()}>Edit</button>;
  };

  if (posts === null) return <div>Loading...</div>;
  // const thisPagePost =
  if (post === null || post === undefined) return <div>such post does not exist</div>;

  return (
    <div className="dataContainer inDetail">
      <div className="postBox">
        <h1>{post.title} </h1>
        {bodyRender(post.body)}
      </div>
      {buttonsRender()}
      <CommentBox />
    </div>
  );
}
